import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { PublicTripsPage } from '../pages/PublicTripsPage';
import { TripsPage } from '../pages/TripsPage';
import { PublicTripPage } from '../pages/PublicTripPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/trips" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/public-trips/:slug" element={<PublicTripPage />} />
        <Route path="/public-trips" element={<PublicTripsPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/test" element={<div>TEST ROUTE WORKS</div>} />
        
      </Routes>
    </BrowserRouter>
  );
}
