import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { readContent } from "@/lib/content";

export default async function Home() {
  const content = await readContent();

  return (
    <main className="overflow-x-hidden">
      <Navbar    data={content.navbar} />
      <Hero      data={content.hero} />
      <Clients   data={content.clients} />
      <Services  data={content.services} />
      <Stats     data={content.stats} />
      <Portfolio data={content.portfolio} />
      <Testimonials data={content.testimonials} />
      <Contact   data={content.contact} />
      <Footer    data={content.footer} />
    </main>
  );
}
