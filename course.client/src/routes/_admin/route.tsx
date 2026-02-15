import {
  Outlet,
  SearchSchemaInput,
  createFileRoute,
} from '@tanstack/react-router';
import { authenticateAdmin } from '#/utils/http';

export const Route = createFileRoute('/_admin')({
  component: AdminRoot,
  beforeLoad: authenticateAdmin,
  validateSearch: (search: Record<string, unknown> & SearchSchemaInput) => {
    return {
      tab: Number(search?.tab ?? 0),
    };
  },
});

function AdminRoot() {
  return <Outlet />;
}
