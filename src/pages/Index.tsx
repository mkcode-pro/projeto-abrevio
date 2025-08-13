import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { PageLayout } from "@/components/layout/PageLayout";

const Index = () => {
  return (
    <PageLayout variant="public">
      <HeroSection />
      <BenefitsSection />
      <TestimonialsSection />
    </PageLayout>
  );
};

export default Index;