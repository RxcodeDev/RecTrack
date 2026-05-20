import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { readContent, readLogos } from "@/lib/content";

export default async function Home() {
  const content = await readContent();
  const logos = await readLogos();
  const logoUrl = logos.logo_url || "/logos/transparente.png";

  return (
    <main className="overflow-x-hidden">
      <Navbar    data={content.navbar} logoUrl={logoUrl} />
      <Hero      data={content.hero} />
      <Clients   data={content.clients} />
      <Services  data={content.services} />
      <Stats     data={content.stats} />
      <Portfolio data={content.portfolio} />
      <Testimonials data={content.testimonials} />
      <Contact   data={content.contact} />
      <Footer    data={content.footer} logoUrl={logoUrl} />
    </main>
  );
}
