import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getUserData } from "./_data-access/get-info-user";
import { ProfileContent } from "./_components/profile";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession();

  if (!session) {
    return {
      title: "Perfil - ALNBarber",
      description: "Perfil - ALNBarber",
    };
  }

  return {
    title: `Perfil | ${session.user?.name} - ALNBarber`,
    description: `Área de perfil do usuário ${session.user?.name}.`,
    authors: [{ name: "ALNBarber" }],
    creator: "ALNBarber",
    publisher: "ALNBarber",
    applicationName: "ALNBarber",
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function Profile() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const user = await getUserData({ userId: session.user?.id });

  if (!user) {
    redirect("/");
  }

  return <ProfileContent user={user} />;
}
