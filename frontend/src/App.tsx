import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import NotFound from "./pages/NotFound/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Merk from "./pages/Merk/Merk";
import CreateMerk from "./pages/Merk/CreateMerk";
import EditMerk from "./pages/Merk/EditMerk";
import Produk from "./pages/Produk/Produk";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/protect/ProtectedRoute";
import Users from "./pages/Users/User";
import EditUser from "./pages/Users/EditUser";
import HomeToko from "./pages/HomeToko";
import CardDetailProduct from "./components/ui-toko/CardDetailProduct";
import CartProduct from "./components/ui-toko/CartProduct";
import UserInfoCard from "./pages/Users/UserInfoCard";
import SearchResults from "./components/ui-toko/SearchResults";
import GoogleCallback from "./components/auth/GoogleCallbacl";
import FacebookCallback from "./components/auth/FacebookCallback";
import GlobalNotification from "./components/ui-toko/GlobalNotification";
import Tipe from "./pages/Tipe/Tipe";
import CreateTipe from "./pages/Tipe/CreateTipe";
import EditTipe from "./pages/Tipe/EditTipe";
import Ukuran from "./pages/Ukuran/Ukuran";
import CreateUkuran from "./pages/Ukuran/CreateUkuran";
import EditUkuran from "./pages/Ukuran/EditUkuran";
import Warna from "./pages/Warna/Warna";
import CreateWarna from "./pages/Warna/CreateWarna";
import EditWarna from "./pages/Warna/EditWarna";
import CreateProduk from "./pages/Produk/CreateProduk";
import EditProduk from "./pages/Produk/EditProduk";
import GambarProduk from "./pages/ProdukImage/GambarProduk";
import CreateGambarProduk from "./pages/ProdukImage/CreateGambarProduk";
import EditGambarProduk from "./pages/ProdukImage/EditGambarProduk";
import TarifPengiriman from "./pages/TarifPengiriman/TarifPengiriman";
import CreateTarifPengiriman from "./pages/TarifPengiriman/CreateTarifPengiriman";
import EditTarifPengiriman from "./pages/TarifPengiriman/EditTarifPengiriman";
import JamOperasional from "./pages/JamOperasional/JamOperasional";
import CreateJamOperasional from "./pages/JamOperasional/CreateJamOperasional";
import EditJamOperasional from "./pages/JamOperasional/EditJamOperasional";
import CreateUser from "./pages/Users/CreateUser";
import Roles from "./pages/Roles/Roles";
import CreateRoles from "./pages/Roles/CreateRoles";
import EditRoles from "./pages/Roles/EditRoles";
import ProductsPage from "./components/ui-toko/ProductCard";
import AboutSection from "./components/ui-toko/About";
import ContactPage from "./components/ui-toko/Contact";
import Varian from "./pages/Varian/Varian";
import CreateVarian from "./pages/Varian/CreateVarian";
import EditVarian from "./pages/Varian/EditVarian";
import Checkout from "./components/ui-toko/Checkout";
import OrderList from "./components/ui-toko/pesanan/OrderList";
import PesananKasir from "./pages/Pesanan/PesananKasir";
import PesananAdmin from "./pages/Pesanan/PesananAdmin";
import DetailLaporanKeuanganKasir from "./pages/LaporanKeuangan/DetailLaporanKeuanganKasir";
import LaporanKeuanganKasir from "./pages/LaporanKeuangan/LaporanKeuanganKasir";
import LaporanKeuanganAdmin from "./pages/LaporanKeuangan/LaporanKeuanganAdmin";
import DetailLaporanKeuanganAdmin from "./pages/LaporanKeuangan/DetailLaporanKeuanganAdmin";
import LaporanRugiLaba from "./pages/LaporanKeuangan/LaporanRugiLaba";
import CustomerService from "./components/ui-toko/customer-service/CustomerService";
import AjukanRefund from "./components/ui-toko/customer-service/AjukanRefund";
import AjukanKomplain from "./components/ui-toko/customer-service/AjukanKomplain";
import RefundAdmin from "./pages/CustomerService/RefundAdmin";
import RefundAdminDetail from "./pages/CustomerService/RefundAdminDetail";
import RefundSaya from "./components/ui-toko/refund/RefundSaya";
import KomplainAdmin from "./pages/CustomerService/KomplainAdmin";
import KomplainAdminDetail from "./pages/CustomerService/KomplainAdminDetail";
import KomplainSaya from "./components/ui-toko/komplain/KomplainSaya";

export default function App() {
  return (
    <>
      <Router>
        <GlobalNotification />
        <ScrollToTop />
        <Routes>
          {/* Login Form And Register */}
          <Route path="/login" element={<SignIn />} />
          <Route path="/google/callback" element={<GoogleCallback />} />
          <Route path="/facebook/callback" element={<FacebookCallback />} />
          <Route path="/register" element={<SignUp />} />
          {/* Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute adminOnly={true}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashbord admin homepage */}
            <Route path="/dashboard" element={<Home />} />
            {/* Master menu */}
            {/* Merk Page */}
            <Route path="/merk" element={<Merk />} />
            <Route path="/create-merk" element={<CreateMerk />} />
            <Route path="/edit-merk/:id_merk" element={<EditMerk />} />
            {/* Tipe Page */}
            <Route path="/tipe" element={<Tipe />} />
            <Route path="/create-tipe" element={<CreateTipe />} />
            <Route path="/edit-tipe/:id_tipe" element={<EditTipe />} />
            {/* Ukuran Page */}
            <Route path="/ukuran" element={<Ukuran />} />
            <Route path="/create-ukuran" element={<CreateUkuran />} />
            <Route path="/edit-ukuran/:id_ukuran" element={<EditUkuran />} />
            {/* Warna Page */}
            <Route path="/warna" element={<Warna />} />
            <Route path="/create-warna" element={<CreateWarna />} />
            <Route path="/edit-warna/:id_warna" element={<EditWarna />} />
            {/* Produk Page */}
            <Route path="/produk" element={<Produk />} />
            <Route path="/create-produk" element={<CreateProduk />} />
            <Route path="/edit-produk/:id_produk" element={<EditProduk />} />
            {/* Produk Gambar */}
            <Route path="/foto-produk" element={<GambarProduk />} />
            <Route
              path="/create-foto-produk"
              element={<CreateGambarProduk />}
            />
            <Route
              path="/edit-foto-produk/:id_foto_produk"
              element={<EditGambarProduk />}
            />
            {/* Varian */}
            <Route path="/varian" element={<Varian />} />
            <Route path="/create-varian" element={<CreateVarian />} />
            <Route path="/edit-varian/:id_varian" element={<EditVarian />} />
            {/* Tarif Pengiriman */}
            <Route path="/tarif-pengiriman" element={<TarifPengiriman />} />
            <Route
              path="/create-tarif-pengiriman"
              element={<CreateTarifPengiriman />}
            />
            <Route
              path="/edit-tarif-pengiriman/:id_tarif_pengiriman"
              element={<EditTarifPengiriman />}
            />
            {/* Jam Operasional */}
            <Route path="/jam-operasional" element={<JamOperasional />} />
            <Route
              path="/create-jam-operasional"
              element={<CreateJamOperasional />}
            />
            <Route
              path="/edit-jam-operasional/:id_jam_operasional"
              element={<EditJamOperasional />}
            />
            {/* Master menu end */}
            {/* Setting menu */}
            {/* Role page */}
            <Route path="/role" element={<Roles />} />
            <Route path="/create-role" element={<CreateRoles />} />
            <Route path="/edit-role/:id_role" element={<EditRoles />} />
            {/* User page */}
            <Route path="/user" element={<Users />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/edit-user/:id_user" element={<EditUser />} />
            {/* Setting menu end */}
            {/* Transaksi page */}
            <Route
              path="/pesanan"
              element={(() => {
                const userData =
                  localStorage.getItem("user") ||
                  sessionStorage.getItem("user");
                let user = null;
                try {
                  user = userData ? JSON.parse(userData) : null;
                } catch (e) {
                  console.log("Error parsing user data:", e);
                  return <Navigate to="/login" replace />;
                }

                if (!user) {
                  return <Navigate to="/login" replace />;
                }

                // Render komponen berdasarkan role
                if (user.id_role == 1) {
                  return <PesananAdmin />;
                } else if (user.id_role == 2) {
                  return <PesananKasir />;
                }

                // Jika role tidak valid, redirect ke home
                return <Navigate to="/" replace />;
              })()}
            />
            <Route path="/komplain" element={<KomplainAdmin />} />
            <Route
              path="/detail-komplain/:id_komplain"
              element={<KomplainAdminDetail />}
            />
            <Route path="/refund" element={<RefundAdmin />} />
            <Route
              path="/detail-refund/:id_refund"
              element={<RefundAdminDetail />}
            />
            {/* Transaksi End Page */}
            {/* Laporan Page */}
            <Route
              path="/laporan-keuangan-saya"
              element={<LaporanKeuanganKasir />}
            />
            <Route
              path="/laporan-keuangan-saya-detail/:id_transaksi"
              element={<DetailLaporanKeuanganKasir />}
            />
            <Route
              path="/laporan-transaksi-keuangan"
              element={<LaporanKeuanganAdmin />}
            />
            <Route
              path="/laporan-transaksi-keuangan-detail/:id_transaksi"
              element={<DetailLaporanKeuanganAdmin />}
            />
            <Route path="/laporan-rugi-laba" element={<LaporanRugiLaba />} />
            {/* Laporan end page */}
          </Route>
          <Route>
            <Route path="/user-profile" element={<UserInfoCard />} />
          </Route>

          {/* Route halaman toko */}
          <Route index path="/" element={<HomeToko />} />
          <Route
            path="/detail-produk/:id_produk"
            element={<CardDetailProduct />}
          />
          <Route path="/komplain-saya" element={<KomplainSaya />} />
          <Route path="/refund-saya" element={<RefundSaya />} />
          <Route path="/pesanan-list" element={<OrderList />} />
          <Route path="/cart-produk" element={<CartProduct />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/produk-list" element={<ProductsPage />} />
          <Route path="/kontak-kami" element={<ContactPage />} />
          <Route path="/about-us" element={<AboutSection />} />
          <Route path="/checkout-produk-page" element={<Checkout />} />
          <Route path="/customer-service-page" element={<CustomerService />} />
          <Route path="/refund-form" element={<AjukanRefund />} />
          <Route path="/complaint-form" element={<AjukanKomplain />} />
          {/* Route halaman toko end */}

          {/* Fallback Route If Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
