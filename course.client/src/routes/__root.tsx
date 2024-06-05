import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import Navigation from '../components/navigation';

export const Route = createRootRoute({
  component: () => (
    <>
      <Navigation />
      <hr />
      <main className='w-[80%] mx-auto'>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  ),
});
