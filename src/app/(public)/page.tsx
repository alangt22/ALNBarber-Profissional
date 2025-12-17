import { Metadata } from "next";
import { About } from "./_components/about";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Professionals } from "./_components/professionals";
import { getProfessional } from "./_data-access/get-professional";

export const revalidate = 120; 
export const metadata: Metadata = {
  title: "ALNBarber | Encontre os melhores barbeiros em um só lugar",
  description:
    "Descubra barbeiros profissionais perto de você, agende seu horário online com facilidade.",
  keywords: [
    "barbearia",
    "gestão de barbearia",
    "agendamento online",
    "SaaS barbearia",
    "plataforma para barbeiros",
    "sistema para barbearia",
    "software barbearia",
    "barbeiros",
    "agenda barbearia",
    "clientes barbearia",
  ],
  openGraph: {
    title: "ALNBarber - Encontre os melhores profissionais em um único local!",
    description:
      "Descubra barbeiros profissionais perto de você, agende seu horário online com facilidade.",
    url: `${process.env.NEXT_PUBLIC_URL}`,
    type: "website",
    images: [`${process.env.NEXT_PUBLIC_URL}/alnbarber.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALNBarber - Encontre os melhores profissionais em um único local!",
    description:
      "Descubra barbeiros profissionais perto de você, agende seu horário online com facilidade.",
    images: [`${process.env.NEXT_PUBLIC_URL}/alnbarber.png`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL}`,
  },
  authors: [{ name: "ALNBarber" }],
  creator: "ALNBarber",
  publisher: "ALNBarber",
  applicationName: "ALNBarber",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },
};

export default async function Home() {

  const professionals = await getProfessional()

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      
      <div>
        <Hero/>

        <About/>
        
        <Professionals professionals={professionals || []}/>

        <Footer/>
      </div>
    </div>
  )
}