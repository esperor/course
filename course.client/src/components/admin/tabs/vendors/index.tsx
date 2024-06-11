import axios from 'axios';
import api from '../../../../api';
import useInfiniteQueryReduced from '../../../../hooks/useInfiniteQueryReduced';
import constant from '../../../../utils/constants';
import Vendor from '../../../../models/vendor';
import PencilSquare from '../../../assets/pencilSquare';
import RowOptions from '../rowOptions';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import VendorEditModal from './vendorEditModal';
import VendorCreateModal from './vendorCreateModal';

export default function VendorsTab() {
  const { data, error, status, queryClient, LoadMoreBtn } =
    useInfiniteQueryReduced<Vendor>({
      queryKey: ['vendors-infinite'],
      queryFn: async ({ pageParam }: { pageParam: unknown }) => {
        const { data } = await axios.get(
          `${api.vendor.rest}?offset=${(pageParam as number) * constant.defaultLimit}&limit=${constant.defaultLimit}`,
        );
        return data;
      },
      limit: constant.defaultLimit,
    });
  const deleteVendor = useMutation({
    mutationFn: async (vendorId: number) => {
      return await axios.delete(`${api.vendor.rest}/${vendorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });

  const [openedOptions, setOpenedOptions] = useState<number | null>(null);
  const [editingVendorId, setEditingVendorId] = useState<number | null>(null);
  const [creatingVendor, setCreatingVendor] = useState(false);

  const handleAction = (vendorId: number, action: 'delete' | 'edit') => {
    switch (action) {
      case 'delete':
        deleteVendor.mutate(vendorId);
        break;
      case 'edit':
        setEditingVendorId(vendorId);
        break;
    }
  };

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error?.message}</div>;

  return (
    <div>
      <button
        type="button"
        className="btn flex ml-auto mb-4"
        onClick={() => setCreatingVendor(true)}
      >
        Добавить поставщика
      </button>
      {creatingVendor && (
        <VendorCreateModal onClose={() => setCreatingVendor(false)} />
      )}
      {editingVendorId && (
        <VendorEditModal
          vendorId={editingVendorId}
          onClose={() => setEditingVendorId(null)}
        />
      )}
      <table className="admin-table mt-4">
        <thead>
          <tr className="bg-slate-600">
            <th>ID</th>
            <th>Номер контракта</th>
            <th>Название</th>
            <th>Контакты</th>
            <th className="justify-center flex options">
              <PencilSquare />
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.pages.map((page) =>
            page.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.id}</td>
                <td>{vendor.contractNumber}</td>
                <td>{vendor.name}</td>
                <td>{vendor.contactInfo}</td>
                <RowOptions
                  itemId={vendor.id}
                  openedOptions={openedOptions}
                  setOpenedOptions={setOpenedOptions}
                  onAction={handleAction}
                />
              </tr>
            )),
          )}
        </tbody>
      </table>
      <div className="w-full flex mt-4">
        <LoadMoreBtn />
      </div>
    </div>
  );
}
