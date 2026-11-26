import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { BasketProvider } from './context/BasketContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { EquipmentPage } from './pages/EquipmentPage';
import { EquipmentDetailPage } from './pages/EquipmentDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BasketPage } from './pages/BasketPage';

export default function App() {
  return (
    <BasketProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/equipment/:slug" element={<EquipmentDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </BasketProvider>
  );
}
