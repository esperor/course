import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '../../../../api';
import Vendor from '../../../../models/server/vendor';
import { useEffect, useState } from 'react';
import Reset from '../../../assets/reset';
import VendorEdit from './vendorEdit';
import Modal from '../../../modal';

export default function VendorEditModal({
  vendorId: vendorId,
  onClose,
}: {
  vendorId: number;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const vendor = useQuery<Vendor>(
    {
      queryKey: ['vendor', vendorId],
      queryFn: async () => {
        const { data } = await axios.get(`${api.vendor.rest}/${vendorId}`);
        return data;
      },
    },
    queryClient,
  );
  const [form, setForm] = useState<Vendor | null>(null);

  useEffect(() => {
    if (!vendor.data) return;
    setForm(vendor.data);
  }, [vendor.data]);

  const formEdited =
    form?.name !== vendor.data?.name ||
    form?.contactInfo !== vendor.data?.contactInfo ||
    form?.contractNumber !== vendor.data?.contractNumber;

  const handleClose = () => {
    if (formEdited) return;
    onClose();
  };

  const handleReset = () => {
    setForm(vendor.data!);
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
      <VendorEdit
        vendor={vendor}
        form={form}
        setForm={setForm}
        formEdited={formEdited}
      />
    </Modal>
  );
}
