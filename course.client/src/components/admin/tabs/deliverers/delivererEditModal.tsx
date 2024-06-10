import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '../../../../api';
import DelivererPostModel from '../../../../models/delivererPostModel';
import { useEffect, useState } from 'react';
import Reset from '../../../assets/reset';
import DelivererEdit from './delivererEdit';
import Modal from '../../../modal';
import Deliverer from '../../../../models/deliverer';

export default function DelivererEditModal({
  delivererId,
  onClose,
}: {
  delivererId: number;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const deliverer = useQuery<Deliverer>(
    {
      queryKey: ['deliverer', delivererId],
      queryFn: async () => {
        const { data } = await axios.get(
          `${api.deliverer.rest}/${delivererId}`,
        );
        return data;
      },
    },
    queryClient,
  );
  const [form, setForm] = useState<DelivererPostModel | null>(null);

  useEffect(() => {
    if (!deliverer.data) return;
    setForm({
      userId: deliverer.data.id,
      contactInfo: deliverer.data.contactInfo,
      contractNumber: deliverer.data.contractNumber,
    });
  }, [deliverer.data]);

  const formEdited =
    (form?.contactInfo !== deliverer.data?.contactInfo &&
      form?.contactInfo !== '') ||
    form?.contractNumber !== deliverer.data?.contractNumber;

  const handleClose = () => {
    if (formEdited) return;
    onClose();
  };

  const handleReset = () => {
    setForm(deliverer.data!);
  };

  return (
    <Modal onClose={handleClose}>
      <div className="absolute right-6 top-6 flex flex-row gap-6 items-center">
        {form && (
          <button
            type="button"
            onClick={handleReset}
            className="size-6 scale-100 active:scale-90"
          >
            <Reset />
          </button>
        )}
        <button
          type="button"
          onClick={handleClose}
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
      <DelivererEdit
        deliverer={deliverer}
        form={form}
        setForm={setForm}
        formEdited={formEdited}
      />
    </Modal>
  );
}
