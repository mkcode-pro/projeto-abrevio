import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { PublicLayout } from "@/components/layout/PublicLayout";

const Index = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <BenefitsSection />
      <TestimonialsSection />
    </PublicLayout>
  );
};

export default Index;