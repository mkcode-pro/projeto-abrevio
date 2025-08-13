import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { BaseLayout } from "@/components/layout/BaseLayout";

const Index = () => {
  return (
    <BaseLayout variant="public" noPadding>
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </BaseLayout>
  );
};

export default Index;