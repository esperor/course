import { useState } from 'react';
import Modal from '../../../../modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '../../../../../api';
import Deliverer from '../../../../../models/server/deliverer';
import CheckCircle from '../../../../assets/checkCircle';
import MagnifyingGlass from '../../../../assets/magnifiyinGlass';
import XCircle from '../../../../assets/xCircle';
import { replaceRouteParams } from '../../../../../utils/http';

export default function AssignDelivererModal({
  orderId,
  onClose,
}: {
  orderId: number;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [deliverer, setDeliverer] = useState<Deliverer | null>(null);
  const [form, setForm] = useState<{ delivererId?: number } | null>(null);
  const [hasAssigned, setHasAssigned] = useState(false);
  const [delivererIdValid, setDelivererIdValid] = useState<
    'valid' | 'invalid' | null
  >(null);
  const validateDeliverer = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.get<Deliverer>(
        `/${api.admin.deliverer.rest}/${id}`,
      );
      return data;
    },
    onSuccess: async (data) => {
      setDelivererIdValid('valid');
      setDeliverer(data);
    },
    onError: () => {
      setDelivererIdValid('invalid');
    },
  }, queryClient);

  const assignDeliverer = useMutation({
    mutationFn: async () => {
      return await axios.put(
        `${replaceRouteParams(api.admin.order.assignDeliverer, { id: orderId })}`,
        form,
      );
    },
    onSuccess: () => {
      setHasAssigned(true);
      queryClient.invalidateQueries({ queryKey: ['orders-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  }, queryClient);

  const handleDelivererIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasAssigned(false);
    const delivererId = e.target.value ? parseInt(e.target.value) : undefined;
    setForm({ ...form!, delivererId });
    if (delivererId) validateDeliverer.mutate(delivererId);
    else setDelivererIdValid(null);
  };

  const handleAssign = () => {
    if (delivererIdValid !== 'valid') return;
    assignDeliverer.mutate();
  };

  return (
    <Modal onClose={onClose}>
      <div className="absolute right-6 top-6 flex flex-row gap-6 items-center">
        <button
          type="button"
          onClick={onClose}
          className="size-6 scale-100 active:scale-90"
        >
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] w-full mx-auto bg-slate-200 rotate-45`}
          ></div>
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] w-full mx-auto bg-slate-200 -rotate-45`}
          ></div>
        </button>
      </div>
      <div className="flex flex-col gap-4 px-4 pt-8 pb-4">
        <div className="flex flex-row gap-2">
          <label htmlFor="delivererId">ID доставщика</label>
          <input
            type="number"
            id="delivererId"
            className={`transparent bordered w-fit 
              ${delivererIdValid == null && !validateDeliverer.isPending ? 'mr-8' : ''}`}
            value={form?.delivererId}
            onChange={handleDelivererIdChange}
          />
          {validateDeliverer.isPending ? (
            <MagnifyingGlass />
          ) : (
            delivererIdValid != null &&
            (delivererIdValid === 'valid' ? (
              <CheckCircle className="stroke-green-600" />
            ) : (
              <XCircle className="stroke-red-500" />
            ))
          )}
        </div>
        <label htmlFor="delivererInfo">
          Информация о выбранном доставщике:
        </label>
        <textarea
          readOnly
          id="delivererInfo"
          className="-mt-4 transparent bordered w-full h-20"
          value={
            delivererIdValid === 'valid'
              ? `Имя: ${deliverer?.name}\nТелефон: ${deliverer?.phone}`
              : ''
          }
        />
        <button
          type="button"
          className="btn mt-auto flex mx-auto"
          disabled={
            delivererIdValid !== 'valid' ||
            assignDeliverer.isPending ||
            hasAssigned
          }
          onClick={handleAssign}
        >
          {assignDeliverer.isPending
            ? 'Загрузка...'
            : hasAssigned
              ? 'Сохранено'
              : 'Назначить'}
        </button>
      </div>
    </Modal>
  );
}
