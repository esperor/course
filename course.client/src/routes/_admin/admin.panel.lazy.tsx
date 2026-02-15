import { createLazyFileRoute } from '@tanstack/react-router';
import DeliverersTab from '#_admin/tabs/deliverers';
import OrdersTab from '#_admin/tabs/orders';
import ProductsTab from '#_admin/tabs/products';
import SellersTab from '#_admin/tabs/sellers';
import StoresTab from '#_admin/tabs/stores';
import Tabs from '#/components/tabs';

export const Route = createLazyFileRoute('/_admin/admin/panel')({
  component: AdminPanel,
});

function AdminPanel() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const tabsMap: Record<string, () => JSX.Element> = {
    Товары: ProductsTab,
    Магазины: StoresTab,
    Продавцы: SellersTab,
    Доставщики: DeliverersTab,
    Заказы: OrdersTab,
  };

  return (
    <div className="page">
      <Tabs
        options={Object.keys(tabsMap)}
        current={search.tab}
        setCurrent={(i) => navigate({ search: { tab: i } })}
      >
        {...Object.entries(tabsMap).map(([name, Tab]) => <Tab key={name} />)}
      </Tabs>
    </div>
  );
}
