import { redirect } from "next/navigation";
import { getInfoSchedule } from "./_data-access/get-info-schedule";
import { ScheduleContent } from "./_components/schedule-content";
import { Metadata } from "next";

interface SchedulePageProps {
  params: { id: string };
}

// Função dinâmica para gerar metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = (await params).id;
  const user = await getInfoSchedule({ userId });

  if (!user) {
    return {
      title: "ALNBarber",
      description: "Encontre os melhores barbeiros e agende horários online.",
    };
  }

  return {
    title: `Agendamento com ${user.name} | ALNBarber`,
    description: `Agende horários com ${user.name}, barbeiro profissional na ALNBarber. Corte de cabelo, barba e outros serviços com facilidade online.`,
    keywords: [
      "barbeiro",
      "barbeiros",
      "corte de cabelo masculino",
      "barba",
      "agendamento online barbearia",
      "marcar horário barbearia",
      "serviços de barbearia",
      "barbearia perto de mim",
      "corte de cabelo",
      "barba e cabelo",
      "estilo masculino",
      "cuidados com a barba",
      "barbearia profissional",
      "ALNBarber",
      "agendamento com barbeiro",
    ],
    openGraph: {
      title: `Agendamento com ${user.name} | ALNBarber`,
      description: `Agende horários com ${user.name}, barbeiro profissional na ALNBarber. Corte de cabelo, barba e outros serviços com facilidade online.`,
      url: `${process.env.NEXT_PUBLIC_URL}/barbearia/${user.id}`,
      type: "website",
      images: [`${process.env.NEXT_PUBLIC_URL}/alnbarber.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: `Agendamento com ${user.name} | ALNBarber`,
      description: `Agende horários com ${user.name}, barbeiro profissional na ALNBarber. Corte de cabelo, barba e outros serviços com facilidade online.`,
      images: [`${process.env.NEXT_PUBLIC_URL}/alnbarber.png`],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}/barbearia/${user.id}`,
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
      },
    },
  };
}

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = (await params).id;
  const user = await getInfoSchedule({ userId });

  if (!user) {
    redirect("/");
  }

  return <ScheduleContent clinic={user} />;
}
