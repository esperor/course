import { useState } from 'react';
import Modal from '../../../modal';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import api from '../../../../api';
import DelivererPostModel from '../../../../models/delivererPostModel';
import UserAdminInfo from '../../../../models/userAdminModel';
import XCircle from '../../../assets/xCircle';
import CheckCircle from '../../../assets/checkCircle';
import MagnifyingGlass from '../../../assets/magnifiyinGlass';
import Deliverer from '../../../../models/deliverer';

export default function DelivererCreateModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<DelivererPostModel | null>(null);
  const [hasPosted, setHasPosted] = useState(false);
  const [userIdValid, setUserIdValid] = useState<
    'valid' | 'invalid' | 'already-assigned' | null
  >(null);
  const [user, setUser] = useState<UserAdminInfo | null>(null);
  const postDeliverer = useMutation({
    mutationFn: async (deliverer: DelivererPostModel) => {
      return await axios.post(`${api.deliverer.rest}`, deliverer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliverers'] });
      queryClient.invalidateQueries({ queryKey: ['deliverers-infinite'] });
      setHasPosted(true);
    },
  });
  const validateUser = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.get<UserAdminInfo>(`${api.user.rest}/${id}`);
      return data;
    },
    onSuccess: async (data) => {
      try {
        await axios.get<Deliverer>(`${api.deliverer.rest}/${data.id}`);
        setUserIdValid('already-assigned');
        setUser(data);
      } catch (error) {
        setUserIdValid('valid');
        setUser(data);
      }
    },
    onError: () => {
      setUserIdValid('invalid');
    },
  });

  const formFilled = form?.contractNumber && form?.userId && userIdValid;

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasPosted(false);
    const userId = e.target.value ? parseInt(e.target.value) : undefined;
    setForm({ ...form!, userId });
    if (userId) validateUser.mutate(userId);
    else setUserIdValid(null);
  };

  const handlePost = () => {
    if (!formFilled) return;
    postDeliverer.mutate(form);
  };

  return (
    <Modal onClose={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="size-6 absolute right-6 top-6 scale-100 active:scale-90"
      >
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] w-full mx-auto bg-slate-200 rotate-45`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] w-full mx-auto bg-slate-200 -rotate-45`}
        ></div>
      </button>
      <div className="flex flex-col p-4 h-full mt-4 gap-4">
        <div className="flex flex-row gap-2">
          <label htmlFor="userId">ID пользователя</label>
          <input
            type="number"
            id="userId"
            className={`transparent bordered w-fit 
              ${userIdValid == null && !validateUser.isPending ? 'mr-8' : ''}`}
            value={form?.userId}
            onChange={handleUserIdChange}
          />
          {validateUser.isPending ? (
            <MagnifyingGlass />
          ) : (
            userIdValid != null &&
            (userIdValid === 'valid' ? (
              <CheckCircle className="stroke-green-600" />
            ) : (
              <XCircle className="stroke-red-500" />
            ))
          )}
        </div>

        <label htmlFor="userInfo">
          Информация о выбранном пользователе:
        </label>
        <textarea
          readOnly
          id="userInfo"
          className="-mt-4 transparent bordered w-full h-20"
          value={
            userIdValid === 'valid' || userIdValid === 'already-assigned'
              ? `${userIdValid === 'already-assigned' ? 'Пользователь уже является доставщиком\n' : ''}` +
                `Имя: ${user?.name}\nТелефон: ${user?.phone}`
              : ''
          }
        />

        <div className="flex flex-row gap-2">
          <label htmlFor="contractNumber">Номер договора</label>
          <input
            type="text"
            id="contractNumber"
            className="transparent bordered w-fit"
            value={form?.contractNumber}
            onChange={(e) => {
              setHasPosted(false);
              setForm({ ...form!, contractNumber: e.target.value });
            }}
          />
        </div>

        <div className="flex flex-row gap-2">
          <label htmlFor="contactInfo">Контакты</label>
          <input
            type="text"
            id="contactInfo"
            className="transparent bordered w-fit"
            value={form?.contactInfo}
            onChange={(e) => {
              setHasPosted(false);
              setForm({ ...form!, contactInfo: e.target.value });
            }}
          />
        </div>

        <button
          type="button"
          className="btn mt-auto flex mx-auto"
          disabled={!formFilled || postDeliverer.isPending || hasPosted}
          onClick={handlePost}
        >
          {postDeliverer.isPending
            ? 'Загрузка...'
            : hasPosted
              ? 'Сохранено'
              : 'Создать'}
        </button>
      </div>
    </Modal>
  );
}
