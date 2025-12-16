import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/NotFound/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Jenis from "./pages/Jenis/Jenis";
import CreateJenis from "./pages/Jenis/CreateJenis";
import EditJenis from "./pages/Jenis/EditJenis";
import Merk from "./pages/Merk/Merk";
import CreateMerk from "./pages/Merk/CreateMerk";
import EditMerk from "./pages/Merk/EditMerk";
import Produk from "./pages/Produk/Produk";
import CreateProduct from "./pages/Produk/CreateProduk";
import EditProduct from "./pages/Produk/EditProduk";
import ProdukImage from "./pages/ProdukImage/ProdukImage";
import CreateProdukImage from "./pages/ProdukImage/CreateProdukImage";
import EditProdukImage from "./pages/ProdukImage/EditProdukImage";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/protect/ProtectedRoute";
import Roles from "./pages/Roles/Roles";
import CreateRoles from "./pages/Roles/CreateRoles";
import EditRoles from "./pages/Roles/EditRoles";
import Users from "./pages/Users/User";
import EditUser from "./pages/Users/EditUser";
import HomeToko from "./pages/HomeToko";
import CardDetailProduct from "./components/ui-toko/CardDetailProduct";
import CartProduct from "./components/ui-toko/CartProduct";
import UserInfoCard from "./pages/Users/UserInfoCard";
import SearchResults from "./components/ui-toko/SearchResults";
import GoogleCallback from "./components/auth/GoogleCallbacl";
import FacebookCallback from "./components/auth/FacebookCallback";
import Payments from "./pages/Payment/Payments";
import Transaction from "./pages/Transaksi/Transaction";
import DetailTransaction from "./pages/Transaksi/DetailTransaction";
import GlobalNotification from "./components/ui-toko/GlobalNotification";
import Tipe from "./pages/Tipe/Tipe";
import CreateTipe from "./pages/Tipe/CreateTipe";
import EditTipe from "./pages/Tipe/EditTipe";

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
            <Route path="/ukuran" element={<Jenis />} />
            <Route path="/create-ukuran" element={<CreateJenis />} />
            <Route path="/edit-ukuran/:id" element={<EditJenis />} />
            {/* Warna Page */}
            <Route path="/warna" element={<Jenis />} />
            <Route path="/create-warna" element={<CreateJenis />} />
            <Route path="/edit-warna/:id" element={<EditJenis />} />
            {/* Produk Page */}
            <Route path="/produk" element={<Produk />} />
            <Route path="/create-produk" element={<CreateProduct />} />
            <Route path="/edit-produk/:id" element={<EditProduct />} />

            {/* Produk Gambar */}
            <Route path="/gambar-produk" element={<ProdukImage />} />
            <Route
              path="/create-gambar-produk"
              element={<CreateProdukImage />}
            />
            <Route
              path="/edit-gambar-produk/:id"
              element={<EditProdukImage />}
            />
            {/* Master menu end */}

            {/* Roles page */}
            <Route path="/roles" element={<Roles />} />
            <Route path="/create-roles" element={<CreateRoles />} />
            <Route path="/edit-roles/:id" element={<EditRoles />} />

            {/* Payment page */}
            <Route path="/payment" element={<Payments />} />
            <Route path="/transaksi" element={<Transaction />} />
            <Route path="/detail-transaksi" element={<DetailTransaction />} />

            {/* User page */}
            <Route path="/users" element={<Users />} />
            <Route path="/edit-users/:id" element={<EditUser />} />
          </Route>
          <Route>
            <Route path="/user-profile" element={<UserInfoCard />} />
          </Route>

          {/* Route halaman toko */}
          <Route index path="/" element={<HomeToko />} />
          <Route
            path="/detail-produk/:nama/:id"
            element={<CardDetailProduct />}
          />
          <Route path="/cart-produk" element={<CartProduct />} />
          <Route path="/search" element={<SearchResults />} />
          {/* Route halaman toko end */}

          {/* Fallback Route If Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
