"use client"

import { useState } from "react"
import { type ProfileFormData, useProfileForm } from "./profile-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader, Clock, Calendar, MapPin, Phone, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Prisma } from "@prisma/client"
import { updateProfile } from "../_actions/update-profile"
import { toast } from "sonner"
import { formatPhone } from "@/utils/formatPhone"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AvatarProfile } from "./profile-avatar"
import { DaysSelector } from "./day-selector"
import { BlockedDatesSelector } from "./blocked-dates-selector"

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>

interface ProfileContentProps {
  user: UserWithSubscription
}

export function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter()
  const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? [])
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>(user.workingDays ?? [])
  const [blockedDates, setBlockedDates] = useState<string[]>(
    (user.blockedDates ?? []).map((d) => {
      return d.toISOString().slice(0, 10)
    }),
  )

  const { update } = useSession()

  const form = useProfileForm({
    name: user.name,
    adress: user.adress,
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone,
    barber: user.barber || "",
    workingDays: user.workingDays,
  })

  function generateTimesSlots(): string[] {
    const hours: string[] = []
    for (let i = 8; i <= 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0")
        const minute = (j * 30).toString().padStart(2, "0")
        hours.push(`${hour}:${minute}`)
      }
    }
    return hours
  }

  const hours = generateTimesSlots()

  function toggleHour(hour: string) {
    setSelectedHours((prev) => (prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour].sort()))
  }

  const timeZone = Intl.supportedValuesOf("timeZone").filter(
    (zone) =>
      zone.startsWith("America/Sao_Paulo") ||
      zone.startsWith("America/Fortaleza") ||
      zone.startsWith("America/Recife") ||
      zone.startsWith("America/Bahia") ||
      zone.startsWith("America/Belem") ||
      zone.startsWith("America/Manaus") ||
      zone.startsWith("America/Cuiaba") ||
      zone.startsWith("America/Boa_Vista"),
  )

  const handleDaysChange = (days: string[]) => {
    setSelectedDays(days)
    form.setValue("workingDays", days)
  }

  async function onSubmit(values: ProfileFormData) {
    setIsLoading(true)
    const response = await updateProfile({
      name: values.name,
      adress: values.adress,
      phone: values.phone,
      status: values.status === "active" ? true : false,
      timeZone: values.timeZone,
      times: selectedHours || [],
      barber: values.barber,
      workingDays: selectedDays,
      blockedDates,
    })

    if (response.error) {
      toast.error(response.error)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    toast.success(response.data)
  }

  async function handleLogout() {
    setIsLogoutLoading(true)
    await signOut()
    await update()
    router.replace("/")
    setIsLogoutLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <AvatarProfile avatarUrl={user.image} userId={user.id} />
              </div>
              <CardTitle className="text-3xl font-bold">Meu Perfil</CardTitle>
              <CardDescription className="text-base">
                Gerencie as informações e configurações da sua clínica
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-500" />
                Informações Básicas
              </CardTitle>
              <CardDescription>Dados principais da clínica e profissional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-muted-foreground">Nome da Barbearia</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite o nome da clínica..." className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-muted-foreground">Nome do Barbeiro</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite o nome do barbeiro..." className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-muted-foreground">
                      Status do Estabelecimento
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">✓ ATIVO (Aberto para agendamentos)</SelectItem>
                          <SelectItem value="inactive">✕ INATIVO (Fechado temporariamente)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-500" />
                Contato e Localização
              </CardTitle>
              <CardDescription>Endereço e telefone para contato com clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="adress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Endereço Completo
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Rua, número, bairro, cidade - UF" className="h-11" />
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
                    <FormLabel className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone / WhatsApp
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="(11) 91234-5678"
                        className="h-11"
                        onChange={(e) => {
                          const formatedValue = formatPhone(e.target.value)
                          field.onChange(formatedValue)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                Horários e Disponibilidade
              </CardTitle>
              <CardDescription>Configure os horários de atendimento e dias de funcionamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Horários de Atendimento */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Horários de Atendimento</Label>
                <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 justify-between hover:bg-emerald-500 hover:border-emerald-500 transition-colors bg-transparent cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {selectedHours.length > 0
                          ? `${selectedHours.length} horários selecionados`
                          : "Selecionar horários de atendimento"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Configurar Horários de Atendimento</DialogTitle>
                    </DialogHeader>
                    <section className="py-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Clique nos horários disponíveis para atendimento. Horários selecionados aparecem destacados.
                      </p>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {hours.map((hour) => (
                          <Button
                            key={hour}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-10 transition-all",
                              selectedHours.includes(hour)
                                ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600"
                                : "hover:border-emerald-300",
                            )}
                            onClick={() => toggleHour(hour)}
                          >
                            {hour}
                          </Button>
                        ))}
                      </div>
                    </section>
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedHours([])}
                      >
                        Limpar Seleção
                      </Button>
                      <Button
                        type="button"
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => setDialogIsOpen(false)}
                      >
                        Confirmar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Dias de Funcionamento */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Dias de Funcionamento
                </Label>
                <div className="rounded-lg border bg-card p-5">
                  <DaysSelector selectedDays={selectedDays} onChange={handleDaysChange} />
                </div>
              </div>

              {/* Datas Bloqueadas */}
              <div className="space-y-3">
                <BlockedDatesSelector initialDates={blockedDates} onChange={setBlockedDates} />
              </div>

              {/* Fuso Horário */}
              <FormField
                control={form.control}
                name="timeZone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-muted-foreground">Fuso Horário</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione o seu fuso horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeZone.map((zone) => (
                            <SelectItem key={zone} value={zone}>
                              {zone.replace("America/", "")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Salvar Alterações"}
            </Button>

            <Button
              type="button"
              variant="destructive"
              className="sm:w-auto h-12 cursor-pointer font-medium shadow-md hover:shadow-lg transition-all"
              onClick={handleLogout}
              disabled={isLogoutLoading}
            >
              {isLogoutLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da Conta
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
