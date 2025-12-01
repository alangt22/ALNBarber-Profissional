// use server
import { Subscription } from "@prisma/client";
import { Session } from "next-auth";
import { getPlan } from "./get-plans";
import { checkSubscriptionExpired } from "./checkSubscriptionExpired";
import { PLANS } from "../plans";


/**
 * Retorno da função
 * send => true/false se o SMS pode ser enviado
 * planId => id do plano (BASIC | PROFESSIONAL | ...)
 * expired => subscription expirada (fallback)
 * plan => dado do PLANS[planId] para uso posterior
 */
export type CanSendSmsResult = {
  send: boolean;
  planId: string | null;
  expired: boolean;
  plan: any | null;
};

export async function canSendSMS(
  subscription: Subscription | null,
  session?: Session | null
): Promise<CanSendSmsResult> {
  try {
    // Se existir subscription ativa -> verifica o plano diretamente
    if (subscription && subscription.status === "active") {
      const planId = subscription.plan;
      // getPlan pode retornar limitações ou info do plano
      const planMeta = await getPlan(planId).catch(() => null);

      // O envio só deve ocorrer quando o plano for PROFESSIONAL
      const send = planId === "PROFESSIONAL";

      return {
        send,
        planId,
        expired: false,
        plan: PLANS[planId] ?? planMeta ?? null,
      };
    }

    // Se não houver subscription ativa, tenta fallback (ex.: teste / trial)
    if (session) {
      const check = await checkSubscriptionExpired(session);
      // check geralmente segue o padrão ResultPermissionProps mostrado no seu exemplo
      // enviamos SMS apenas se o planId for PROFESSIONAL e a assinatura não estiver expirada
      const send = check.planId === "PROFESSIONAL" && check.hasPermission && !check.expired;
      return {
        send,
        planId: check.planId ?? null,
        expired: !!check.expired,
        plan: check.plan ?? null,
      };
    }

    // default: não enviar
    return {
      send: false,
      planId: null,
      expired: false,
      plan: null,
    };
  } catch (error) {
    console.error("Erro em canSendSMS:", error);
    return {
      send: false,
      planId: null,
      expired: false,
      plan: null,
    };
  }
}
