import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind.css';
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient();
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
      import("@tanstack/query-core").QueryClient;
  }
}

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
