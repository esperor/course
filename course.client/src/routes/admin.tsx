import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { authenticateAdmin } from '../utils/http';
import Tabs from '../components/tabs';
import ProductsTab from '../components/admin/tabs/products';
import VendorsTab from '../components/admin/tabs/vendors';
import DeliverersTab from '../components/admin/tabs/deliverers';
import OrdersTab from '../components/admin/tabs/orders';

export const Route = createFileRoute('/admin')({
  component: Admin,
  beforeLoad: authenticateAdmin,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: Number(search.tab ?? 0),
    };
  },
});

function Admin() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <div className="page">
      <Tabs
        options={['Товары', 'Поставщики', 'Доставщики', 'Заказы']}
        current={search.tab}
        setCurrent={(i) => navigate({ search: { tab: i } })}
      >
        <ProductsTab />
        <VendorsTab />
        <DeliverersTab />
        <OrdersTab />
      </Tabs>
    </div>
  );
}
