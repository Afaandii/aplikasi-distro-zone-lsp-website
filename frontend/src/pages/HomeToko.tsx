import Carousel from "../components/ui-toko/Carousel";
import Footer from "../components/ui-toko/Footer";
import Navigation from "../components/ui-toko/Navigation";
import ProductsPage from "../components/ui-toko/ProductCard";

export default function HomeToko() {
  return (
    <>
      {/* navigasi */}
      <Navigation />

      <main className="pt-14 bg-white min-h-screen">
        {/* carousel banner */}
        <Carousel />
        <ProductsPage />
      </main>
      {/* footer */}
      <Footer />
    </>
  );
}
