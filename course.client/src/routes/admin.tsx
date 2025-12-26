import { createFileRoute, SearchSchemaInput, useNavigate } from '@tanstack/react-router';
import { authenticateAdmin } from '../utils/http';
import Tabs from '../components/tabs';
import ProductsTab from '../components/admin/tabs/products';
import StoresTab from '../components/admin/tabs/stores';
import DeliverersTab from '../components/admin/tabs/deliverers';
import OrdersTab from '../components/admin/tabs/orders';
import SellersTab from '../components/admin/tabs/sellers';

export const Route = createFileRoute('/admin')({
  component: Admin,
  beforeLoad: authenticateAdmin,
  validateSearch: (search: Record<string, unknown> & SearchSchemaInput) => {
    return {
      tab: Number(search?.tab ?? 0),
    };
  },
});

function Admin() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

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
