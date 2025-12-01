import twilio from "twilio";
import { normalizeToE164 } from "./phones";

export async function sendSMS(
  rawTo: string,
  message: string,
  sendAt?: Date // opcional: se passado, agenda a mensagem
) {
  const client = twilio(
    process.env.TWILIO_SID!,
    process.env.TWILIO_AUTH!
  );

  const to = normalizeToE164(rawTo, "BR");

  if (!to) {
    console.error("Número inválido:", rawTo);
    return {
      success: false,
      error: "Telefone inválido. Use DDD + número. Ex: +5511999999999"
    };
  }

  try {
    const params: any = {
      body: message,
      from: process.env.TWILIO_SMS_NUMBER!,
      to,
    };

    // Se enviar agendado
    if (sendAt) {
      params.scheduleType = "fixed";
      params.sendAt = sendAt.toISOString(); // UTC ISO string
    }

    const result = await client.messages.create(params);

    console.log("SMS enviado:", { sid: result.sid, to });
    return { success: true, sid: result.sid, to };
  } catch (error) {
    console.error("Erro ao enviar SMS:", error);
    return { success: false, error };
  }
}
