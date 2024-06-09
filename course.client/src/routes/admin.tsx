import { createFileRoute } from '@tanstack/react-router';
import { authenticateAdmin } from '../utils/http';
import Tabs from '../components/tabs';
import ProductsTab from '../components/admin/tabs/products';

export const Route = createFileRoute('/admin')({
  component: Admin,
  beforeLoad: authenticateAdmin,
});

function Admin() {
  return (
    <div className="page">
      <Tabs
        options={[
          'Товары',
          'Поставщики',
          'Заказы',
          'Доставщики',
        ]}
      >
        <ProductsTab />
        <div>Пользователи</div>
      </Tabs>
    </div>
  );
}
