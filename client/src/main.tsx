import 'leaflet/dist/leaflet.css';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { store } from './app/store';
import { router } from './app/router';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <CssBaseline />
    <RouterProvider router={router} />
  </Provider>
);
