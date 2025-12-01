"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendSMS } from "@/lib/sendSMS";

import { Subscription } from "@prisma/client";
import { canSendSMS } from "@/utils/permissions/can-send-sms";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("O email é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  date: z.date(),
  serviceId: z.string().min(1, "O serviço é obrigatório"),
  time: z.string().min(1, "O horário é obrigatório"),
  clinicId: z.string().min(1, "O id da barbearia é obrigatório"),
  barberName: z.string().optional().nullable(),
});
type FormSchema = z.infer<typeof formSchema>;

function formatDateShort(d: Date) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2); // "25"
  return `${day}/${month}/${year}`;
}

export async function createNewAppointment(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  }

  try {
    // fallback barber/clinic name
    let barberToUse = formData.barberName ?? "";

    // parse date/time
    const selectedDate = new Date(formData.date);
    const [hours, minutes] = formData.time.split(":").map(Number);
    const appointmentDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hours,
      minutes
    );

    // create appointment
    const newAppointment = await prisma.appoitments.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        time: formData.time,
        appointmentDate,
        serviceId: formData.serviceId,
        userId: formData.clinicId,
        barberName: barberToUse,
      },
    });

    // get clinic phone and barber name if missing
    const clinic = await prisma.user.findUnique({
      where: { id: formData.clinicId },
      select: { phone: true, name: true, barber: true },
    });
    if (!barberToUse) barberToUse = clinic?.name ?? "Barbearia";

    const barberPhoneRaw = clinic?.phone ?? "";
    const barberPhone = barberPhoneRaw.replace(/\D/g, "");
    if (!barberPhone) {
      console.warn("Telefone da barbearia ausente — SMS não enviado.");
      return { data: newAppointment, warning: "Telefone da barbearia ausente" };
    }

    // ///////////////////////////////
    // --> VERIFICAÇÃO DO PLANO AQUI
    // busca subscription ativa da barbearia (caso exista)
    const subscription: Subscription | null = await prisma.subscription.findFirst({
      where: {
        userId: formData.clinicId,
      },
      orderBy: { createdAt: "desc" },
    });

    // decide se envia SMS
    const { send } = await canSendSMS(subscription);

    if (!send) {
      // não enviar SMS porque o plano é BASIC ou não tem assinatura ativa
      return { data: newAppointment, smsEnviado: false, note: "Plano BASIC ou sem assinatura ativa — SMS não enviado" };
    }

    // mensagem curta solicitada — sem acentos/char especiais (GSM-7)
    const dateShort = formatDateShort(selectedDate); // 12/01/25
    const smsMessage = `${clinic?.name}
${formData.name} Agendamento: ${dateShort} - ${formData.time}
Confirmar: https://wa.me/55${barberPhone}?text=Confirmar%20agendamento`;

    // envia SMS para o cliente (apenas se send === true)
    await sendSMS(formData.phone, smsMessage);

    return { data: newAppointment, smsEnviado: true };
  } catch (error) {
    console.error("Erro ao cadastrar agendamento:", error);
    return { error: "Erro ao cadastrar agendamento" };
  }
}
