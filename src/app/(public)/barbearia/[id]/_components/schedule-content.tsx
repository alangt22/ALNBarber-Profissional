"use client"
import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import imgTeste from "../../../../../../public/foto1.png"
import { Loader, MapPin, Calendar, Clock, User, Mail, Phone } from "lucide-react"
import type { Prisma } from "@prisma/client"
import { useAppoitmentForm, type AppointmentFormData } from "./schedule-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { formatPhone } from "@/utils/formatPhone"
import { DateTimePicker } from "./date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScheduleTimeList } from "./schedule-time-list"
import { createNewAppointment } from "../_actions/create-appointments"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { FaWhatsapp } from "react-icons/fa"

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
    services: true
  }
}>

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription
}

export interface TimeSlot {
  time: string
  available: boolean
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppoitmentForm()
  const { watch } = form

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [appointmentData, setAppointmentData] = useState<any>(null)

  const selectedDAte = watch("date")
  const selectedServiceId = watch("serviceId")

  const [selectedTime, setSelectedTime] = useState("")
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [blockedTimes, setBlockedTimes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchBlockedTimes = useCallback(
    async (date: Date): Promise<string[]> => {
      setLoadingSlots(true)
      try {
        const dateString = date.toISOString().split("T")[0]
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`,
        )
        const json = await response.json()
        setLoadingSlots(false)
        return json
      } catch (error) {
        setLoadingSlots(false)
        return []
      }
    },
    [clinic.id],
  )

  useEffect(() => {
    if (selectedDAte) {
      fetchBlockedTimes(selectedDAte).then((blocked) => {
        setBlockedTimes(blocked)
        const times = clinic.times || []
        const finalSlot = times.map((time) => ({
          time: time,
          available: !blocked.includes(time),
        }))
        setAvailableTimeSlots(finalSlot)
        const stillAvailable = finalSlot.find((slot) => slot.time === selectedTime && slot.available)
        if (!stillAvailable) setSelectedTime("")
      })
    }
  }, [selectedDAte, clinic.times, fetchBlockedTimes, selectedTime])

  async function handleRegisterAppointment(formData: AppointmentFormData) {
    setIsLoading(true)
    if (!selectedTime) return

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      time: selectedTime,
      date: formData.date,
      serviceId: formData.serviceId,
      clinicId: clinic.id,
      barberName: clinic.barber ?? "",
    })

    if (response.error) {
      toast.error(response.error)
      setIsLoading(false)
      return
    }

    // 👉 Salva os dados para exibir no dialog
    setAppointmentData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      time: selectedTime,
      date: formData.date,
      service: clinic.services.find((s) => s.id === formData.serviceId)?.name,
      barber: clinic.barber ?? "",
      clinicName: clinic.name,
    })

    // 👉 Abre o modal
    setIsDialogOpen(true)

    // ❗ Mantenha o toast do WhatsApp se quiser:
    toast.success(
      <div>
        <a
          target="_blank"
          href={`https://wa.me/+55${clinic.phone?.replace(
            /\D/g,
            "",
          )}?text=Olá!%0A%0ADesejo confirmar o meu agendamento.`}
          rel="noreferrer"
        >
          Agendamento confirmado!
        </a>
      </div>,
      {
        duration: 5000,
        closeButton: true,
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#0cde7c",
          color: "#fff",
        },
      },
    )

    form.reset()
    setSelectedTime("")
    setIsLoading(false)
  }

  // dias bloqueados
  const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }

  const allowedDays = clinic.workingDays.map((day) => dayMap[day.toLowerCase()])

  const clinicBlockedDatesForPicker: (string | Date)[] = (clinic as any).blockedDates
    ? (clinic as any).blockedDates.map((d: Date | string) => (typeof d === "string" ? d : d.toISOString()))
    : []

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <div className="h-40 w-full bg-gradient-to-br from-primary/10 via-primary/5 to-background" />

      <section className="container mx-auto px-4 -mt-24">
        <div className="max-w-3xl mx-auto">
          <article className="bg-card rounded-xl shadow-lg border p-8 mb-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl mb-6">
                <Image
                  src={clinic.image ? clinic.image : imgTeste}
                  alt="Foto da clínica"
                  className="object-cover"
                  fill
                />
              </div>

              <h1 className="text-3xl font-bold mb-3 text-balance">{clinic.name}</h1>

              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{clinic.adress || "Endereço não informado"}</span>
              </div>

              {clinic.barber && (
                <div className="mt-4 px-6 py-2 bg-primary/10 rounded-full">
                  <p className="text-sm font-medium text-primary">Barbeiro: {clinic.barber}</p>
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      <section className="max-w-3xl mx-auto w-full px-4 pb-16">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegisterAppointment)} className="space-y-6">
            {/* Card: Informações Pessoais */}
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Informações Pessoais</h2>
                  <p className="text-sm text-muted-foreground">Preencha seus dados para contato</p>
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nome completo
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo..." className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu email..." type="email" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(XX) XXXXX-XXXX"
                          className="h-11"
                          {...field}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Card: Agendamento */}
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Detalhes do Agendamento</h2>
                  <p className="text-sm text-muted-foreground">Escolha data, serviço e horário</p>
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Data do agendamento
                      </FormLabel>
                      <FormControl>
                        <DateTimePicker
                          initialDate={new Date()}
                          className="w-full h-11 rounded-md border px-3"
                          allowedDays={allowedDays}
                          onChange={(date) => {
                            if (date) {
                              field.onChange(date)
                              setSelectedTime("")
                            }
                          }}
                          blockedDates={clinicBlockedDatesForPicker}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Serviço
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedTime("")
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Selecione um serviço" />
                          </SelectTrigger>
                          <SelectContent>
                            {clinic.services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} ({Math.floor(service.duration / 60)}h {service.duration % 60}min)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Card: Horários Disponíveis */}
            {selectedServiceId && (
              <div className="bg-card rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Horários Disponíveis</h2>
                    <p className="text-sm text-muted-foreground">Escolha o melhor horário para você</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="border-2 border-destructive h-8 w-12 rounded-md" />
                    <span className="text-xs font-medium">Ocupado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="border h-8 w-12 rounded-md bg-background" />
                    <span className="text-xs font-medium">Disponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="border-2 border-green-600 h-8 w-12 rounded-md bg-green-600/10" />
                    <span className="text-xs font-medium">Selecionado</span>
                  </div>
                </div>

                {loadingSlots ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">Carregando horários...</span>
                  </div>
                ) : availableTimeSlots.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Nenhum horário disponível para esta data</p>
                  </div>
                ) : (
                  <ScheduleTimeList
                    onSelectTime={(time) => setSelectedTime(time)}
                    clinicTimes={clinic.times}
                    blockedTimes={blockedTimes}
                    availableTimeSlots={availableTimeSlots}
                    selectedTime={selectedTime}
                    selecedDate={selectedDAte}
                    requiredSlots={
                      clinic.services.find((s) => s.id === selectedServiceId)
                        ? Math.ceil(clinic.services.find((s) => s.id === selectedServiceId)!.duration / 30)
                        : 1
                    }
                  />
                )}
              </div>
            )}

            {clinic.status ? (
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200"
                disabled={
                  isLoading || !watch("name") || !watch("email") || !watch("phone") || !watch("date") || !selectedTime
                }
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Confirmar Agendamento
                  </span>
                )}
              </Button>
            ) : (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-center px-6 py-4 rounded-lg">
                <p className="font-medium">A clínica está fechada no momento</p>
                <p className="text-sm mt-1 opacity-90">Tente novamente mais tarde</p>
              </div>
            )}
          </form>
        </Form>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-500/10 rounded-full">
              <Calendar className="w-6 h-6 text-green-500" />
            </div>
            <DialogTitle className="text-center text-xl">Agendamento Confirmado!</DialogTitle>
            <DialogDescription className="text-center">Confira os detalhes do seu agendamento</DialogDescription>
          </DialogHeader>

          {appointmentData && (
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Nome</p>
                    <p className="text-sm font-medium truncate">{appointmentData.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Local</p>
                    <p className="text-sm font-medium">{appointmentData.clinicName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Serviço</p>
                    <p className="text-sm font-medium">{appointmentData.service}</p>
                  </div>
                </div>

                {appointmentData.barber && (
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">Barbeiro</p>
                      <p className="text-sm font-medium">{appointmentData.barber}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Data</p>
                      <p className="text-sm font-medium">{appointmentData.date.toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Horário</p>
                      <p className="text-sm font-medium">{appointmentData.time}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Phone className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Contato</p>
                    <p className="text-sm font-medium">{clinic.phone}</p>
                  </div>
                </div>
              </div>

              <a
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://wa.me/+55${clinic.phone?.replace(
                  /\D/g,
                  "",
                )}?text=Olá!%0A%0ADesejo confirmar o meu agendamento.`}
              >
                <FaWhatsapp className="w-5 h-5" />
                Confirmar via WhatsApp
              </a>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="w-full">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
