import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from './components/ToastContainer';
import Home from './pages/index';
import NotFoundPage from './pages/404';
import ShortLinkPage from './pages/shortlink/index';

export default function App() {
  return (
    <BrowserRouter>
      <div className="antialiased font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/:slug" element={<ShortLinkPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}
