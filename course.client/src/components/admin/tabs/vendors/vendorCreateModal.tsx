import { useState } from 'react';
import Modal from '../../../modal';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import api from '../../../../api';
import VendorPostModel from '../../../../models/vendorPostModel';

export default function VendorCreateModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<VendorPostModel | null>(null);
  const [hasPosted, setHasPosted] = useState(false);
  const postVendor = useMutation({
    mutationFn: async (vendor: VendorPostModel) => {
      return await axios.post(`${api.vendor.rest}`, vendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendors-infinite'] });
      setHasPosted(true);
    },
  });

  const formFilled = form?.contractNumber && form?.name && form?.contactInfo;

  const handlePost = () => {
    if (!formFilled) return;
    postVendor.mutate(form);
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
      <div className="flex flex-col p-4 h-full">
        <label htmlFor="contractNumber">Номер договора</label>
        <input
          type="text"
          id="contractNumber"
          className="font-bold mb-4 transparent bordered w-fit"
          value={form?.contractNumber}
          onChange={(e) => {
            setHasPosted(false);
            setForm({ ...form!, contractNumber: e.target.value });
          }}
        />

        <label htmlFor="name">Название</label>
        <input
          type="text"
          id="name"
          className="font-bold mb-4 transparent bordered w-fit"
          value={form?.name}
          onChange={(e) => {
            setHasPosted(false);
            setForm({ ...form!, name: e.target.value });
          }}
        />

        <label htmlFor="contactInfo">Контакты</label>
        <input
          type="text"
          id="contactInfo"
          className="font-bold mb-4 transparent bordered w-fit"
          value={form?.contactInfo}
          onChange={(e) => {
            setHasPosted(false);
            setForm({ ...form!, contactInfo: e.target.value });
          }}
        />

        <button
          type="button"
          className="btn mt-auto flex mx-auto"
          disabled={!formFilled || postVendor.isPending || hasPosted}
          onClick={handlePost}
        >
          {postVendor.isPending
            ? 'Загрузка...'
            : hasPosted
              ? 'Сохранено'
              : 'Создать'}
        </button>
      </div>
    </Modal>
  );
}
