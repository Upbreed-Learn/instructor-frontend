import { createBrowserRouter, RouterProvider } from 'react-router';
import { NuqsAdapter } from 'nuqs/adapters/react';
import QueryProvider from './lib/query-provider';
import RootLayout from './layout';
import Overview from './overview';
import Courses from './courses';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // loader: checkAuthLoader,
    children: [
      {
        path: '/',
        // element: <Dashboard />,
        element: <Overview />,
      },
      // {
      //   path: "/projects",
      //   children: [
      //     {
      //       index: true,
      //       element: <Projects />,
      //     },
      //     {
      //       path: "/projects/:id",
      //       element: <UpdateProject />,
      //     },
      //   ],
      // },
      {
        path: '/courses',
        element: <Courses />,
      },
      // {
      //   path: "/finance",
      //   element: <Finance />,
      // },
      // {
      //   path: "/instructors",
      //   element: <Instructors />,
      // },
      // {
      //   path: "/blog",
      //   children: [
      //     {
      //       index: true,
      //       element: <Blogs />,
      //     },
      //     {
      //       path: "/blog/create",
      //       element: <CreateBlog />,
      //     },
      //     {
      //       path: "/blog/:id",
      //       element: <CreateBlog />,
      //     },
      //   ],
      // },
      // {
      //   path: "/1-1-sessions",
      //   element: <OneOneSessions />,
      // },
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
