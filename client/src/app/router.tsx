import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './Layouts/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { TripsPage } from '../pages/TripsPage';
import { Navigate } from 'react-router-dom';
import { PublicTripsPage } from '../pages/PublicTripsPage';
import { PublicTripPage } from '../pages/PublicTripPage';
import { TripPage } from '../pages/TripPage';
import { ProtectedRoute } from '../shared/ui/ProtectedRoute';
import { CreateTripPage } from '../pages/CreateTripPage';
import { EditTripPage } from '../pages/EditTripPage';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/trips',
            element: <TripsPage />,
          },
          {
            path: '/trips/new',
            element: <CreateTripPage />,
          },
          {
            path: '/trips/:id/edit',
            element:<EditTripPage />
          },
          {
            path: '/trips/:id',
            element: <TripPage />,
          },
        ],
      },
      {
        path: '/public-trips',
        element: <PublicTripsPage />,
      },
      {
        path: '/public-trips/:slug',
        element: <PublicTripPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Navigate to="/public-trips" replace />,
  },
]);
