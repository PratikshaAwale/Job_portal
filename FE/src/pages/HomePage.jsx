import HeroSection from '../components/hero/HeroSection.jsx';
import CategoriesSection from '../components/categories/CategoriesSection.jsx';
import FeaturedJobs from '../components/jobs/FeaturedJobs.jsx';
import TrendingJobsSlider from '../components/jobs/TrendingJobsSlider.jsx';
import TopCompanies from '../components/companies/TopCompanies.jsx';
import WhyChooseUs from '../components/why-choose/WhyChooseUs.jsx';
import TestimonialsSection from '../components/testimonials/TestimonialsSection.jsx';
import NewsletterSection from '../components/newsletter/NewsletterSection.jsx';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <TrendingJobsSlider />
      <FeaturedJobs />
      <TopCompanies />
      <WhyChooseUs />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
