import { readContent, readLogos } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioFull from "@/components/PortfolioFull";

export default async function PortafolioPage() {
  const content = await readContent();
  const logos = await readLogos();
  const logoUrl = logos.logo_url || "/logos/transparente.png";

  return (
    <main className="overflow-x-hidden">
      <Navbar data={content.navbar} logoUrl={logoUrl} />
      <PortfolioFull data={content.portfolioPage} />
      <Footer data={content.footer} logoUrl={logoUrl} />
    </main>
  );
}
