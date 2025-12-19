import CategoriesSection from "../components/ui-toko/CategoriesSection";
import ContactForm from "../components/ui-toko/Contact";
import FeaturedProducts from "../components/ui-toko/FeaturedProduct";
import FeaturesSection from "../components/ui-toko/FeaturedSection";
import Footer from "../components/ui-toko/Footer";
import Demo from "../components/ui-toko/Hero";
import Navigation from "../components/ui-toko/Navigation";
import TestimonialsSection from "../components/ui-toko/Testimonials";

export default function HomeToko() {
  return (
    <>
      {/* navigasi */}
      <Navigation />

      <main className="pt-14 bg-white min-h-screen">
        {/* carousel banner */}
        <Demo />
        <FeaturedProducts />
        <FeaturesSection />
        <CategoriesSection />
        <TestimonialsSection />
        <ContactForm />
      </main>
      {/* footer */}
      <Footer />
    </>
  );
}
