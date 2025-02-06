import "./App.css";
import Dasboard from "./pages/Dasboard";
import DetailPendaftaran from "./pages/DetailPendaftar";
import InformasiPPDB from "./pages/InformasiPPDB";
import ImageSlider from "./pages/ImageSlider";
import Sidebar from "./component/Sidebar";
import DetailCalonSiswa from "./pages/DetailCalonSiswa";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import TambahImg from "./pages/slider/TambahImg";
import EditImg from "./pages/slider/Editimg";
import Faqs from "./pages/Faqs";

function App() {
  const location = useLocation(); // Menggunakan useLocation untuk memantau rute saat ini

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-200">
      {/* Tampilkan Sidebar hanya jika bukan halaman Login */}
      {location.pathname !== "/" && <Sidebar />}
      <Toaster />
      <div>
        <Routes>
          <Route path="/dashboard" element={<Dasboard />} />
          <Route path="/detailPendaftar" element={<DetailPendaftaran />} />
          <Route
            path="/detail-pendaftaran/:id"
            element={<DetailCalonSiswa />}
          />
          <Route path="/informasiPPDB/:id" element={<InformasiPPDB />} />
          <Route path="/imageSlider" element={<ImageSlider />} />
          <Route path="/TambahImage" element={<TambahImg />} />
          <Route path="/EditImage/:id" element={<EditImg />} />
          <Route path="/Faqs" element={<Faqs />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
