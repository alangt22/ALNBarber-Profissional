import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ServicesContent } from "./_components/service-content";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Serviços | ALNBarber",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};
export default async function Services() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <section>

        <ServicesContent userId={session.user?.id!} />

    </section>
  );
}
