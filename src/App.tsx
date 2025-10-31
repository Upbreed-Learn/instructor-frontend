import { createBrowserRouter, RouterProvider } from 'react-router';
import { NuqsAdapter } from 'nuqs/adapters/react';
import QueryProvider from './lib/query-provider';
import RootLayout from './layout';
import Overview from './overview';
import Courses from './courses';
import Insights from './insights';
import Earnings from './earnings';
import Sessions from './sessions';
import Settings from './settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // loader: checkAuthLoader,
    children: [
      {
        path: '/',
        element: <Overview />,
      },
      {
        path: '/courses',
        element: <Courses />,
      },
      {
        path: '/insights',
        element: <Insights />,
      },
      {
        path: '/earnings',
        element: <Earnings />,
      },
      {
        path: '/sessions',
        element: <Sessions />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  // {
  //   path: "/auth/login",
  //   element: <Login />,
  // },
]);

function App() {
  return (
    <div className="App">
      <NuqsAdapter>
        <QueryProvider>
          <RouterProvider router={router} />
        </QueryProvider>
      </NuqsAdapter>
    </div>
  );
}

export default App;
