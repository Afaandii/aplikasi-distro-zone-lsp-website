import CardProduct from "../components/ui-toko/CardProduct";
import Carousel from "../components/ui-toko/Carousel";
import CategoryProduct from "../components/ui-toko/CategoryProduct";
import Footer from "../components/ui-toko/Footer";
import Navigation from "../components/ui-toko/Navigation";

export default function HomeToko(){
  return (
    <>
      {/* navigasi */}
      <Navigation />

      <main className="md:pt-[130px] pt-14 pb-16 bg-white min-h-screen">
        {/* carousel banner */}
        <Carousel />
        {/* carousel category */}
        <CategoryProduct />
        {/* card produk */}
        <CardProduct />
      </main>
        {/* footer */}
        <Footer />
    </>
  )
}