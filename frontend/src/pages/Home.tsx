import { Hero } from "../sections/home/Hero";
import { DoctorProfile } from "../sections/home/DoctorProfile";
import { ServicesOverview } from "../sections/home/ServicesOverview";
import { VideoReviews } from "../sections/home/VideoReviews";
import { CuratedTestimonials } from "../sections/home/CuratedTestimonials";
import { PublicFeedbackForm } from "../sections/home/PublicFeedbackForm";
import { FinalCta } from "../sections/home/FinalCta";

export function Home() {
  return (
    <div>
      <Hero />
      <DoctorProfile />
      <ServicesOverview />
      <VideoReviews />
      <CuratedTestimonials />
      <PublicFeedbackForm />
      <FinalCta />
    </div>
  );
}
