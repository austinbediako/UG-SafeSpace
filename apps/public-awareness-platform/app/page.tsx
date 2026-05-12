import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import MisconductSection from "@/components/sections/MisconductSection";
import RightsSection from "@/components/sections/RightsSection";
import ReportingProcess from "@/components/sections/ReportingProcess";
import EmergencySupport from "@/components/sections/EmergencySupport";
import HomeFAQ from "@/components/sections/HomeFAQ";
import PolicyAccess from "@/components/sections/PolicyAccess";

export const metadata: Metadata = {
  title: "SafeSpace UG — Know Your Rights. Report Safely. Get Support.",
  description:
    "The University of Ghana's official platform for sexual harassment awareness, policy education, rights information, and support resources.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <MisconductSection />
      <RightsSection />
      <ReportingProcess />
      <EmergencySupport />
      <HomeFAQ />
      <PolicyAccess />
    </>
  );
}
