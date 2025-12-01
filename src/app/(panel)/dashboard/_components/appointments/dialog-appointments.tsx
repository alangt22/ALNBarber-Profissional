import { DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import type { AppointmentWithService } from "./appointments-list"
import { FaWhatsapp } from "react-icons/fa"
import { formatCurrency } from "@/utils/formatCurrency"
import { Calendar, Clock, User, Phone, Mail, Scissors, DollarSign, UserCheck } from "lucide-react"

interface DialogAppointmentProps {
  appointment: AppointmentWithService | null
}

export function DialogAppointments({ appointment }: DialogAppointmentProps) {
  return (
    <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      <DialogHeader>
        <DialogTitle>Detalhes do Agendamento</DialogTitle>
        <DialogDescription>Informações sobre o agendamento</DialogDescription>
      </DialogHeader>

      {appointment && (
        <div className="space-y-4 py-4">
          {/* Data e Hora */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Data</p>
                <p className="font-medium text-sm">
                  {new Intl.DateTimeFormat("pt-BR", {
                    timeZone: "UTC",
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  }).format(new Date(appointment.appointmentDate))}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Horário</p>
                <p className="font-medium text-sm">{appointment.time}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Cliente</h4>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Nome</p>
                <p className="font-medium text-sm">{appointment.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Telefone</p>
                <p className="font-medium text-sm">{appointment.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-sm break-all">{appointment.email}</p>
              </div>
            </div>

            {/* WhatsApp - versão compacta */}
            <a
              target="_blank"
              href={`https://wa.me/55${appointment.phone.replace(/\D/g, "")}?text=Olá,%20seu%20agendamento%20esta%20confirmado%20para%20o%20dia%20${new Intl.DateTimeFormat(
                "pt-BR",
                {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                },
              ).format(
                new Date(appointment.appointmentDate),
              )}%20ás%20${appointment.time}%20horas%20para%20o%20serviço%20${appointment.service.name}%20.%20Barbeiro:${appointment.barberName}`}
              className="flex items-center justify-center gap-2 text-green-600 hover:text-green-700 transition-colors w-full p-2 rounded-md bg-green-50 hover:bg-green-100 text-sm"
              rel="noreferrer"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span className="font-medium">Enviar WhatsApp</span>
            </a>
          </div>

          <div className="border-t pt-4 space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Serviço</h4>
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Serviço</p>
                <p className="font-medium text-sm">{appointment.service.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Valor</p>
                <p className="font-medium text-green-600">{formatCurrency(appointment.service.price / 100)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Barbeiro</p>
                <p className="font-medium text-sm">{appointment.barberName}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  )
}
