import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MobileOptimizedBenefits from "@/components/MobileOptimizedBenefits";
import CompactTestimonials from "@/components/CompactTestimonials";
import OptimizedFooter from "@/components/OptimizedFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <MobileOptimizedBenefits />
        <CompactTestimonials />
      </main>
      <OptimizedFooter />
    </div>
  );
};

export default Index;
