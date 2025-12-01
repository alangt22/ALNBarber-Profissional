"use client"

import { Check, Loader, Sparkles, Calendar, Clock, Users, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { handleRegister } from "../_actions/login"

export function About() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(provider: "google") {
    await handleRegister(provider)
    setIsLoginModalOpen(false)
  }

  function handleChange() {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsLoginModalOpen(true)
    }, 500)
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className="relative order-2 lg:order-1 space-y-6"
            data-aos="fade-right"
            data-aos-offset="200"
            data-aos-easing="ease-in-sine"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6 space-y-3 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-muted-foreground">Digital</p>
                </div>
              </div>
      
            </div>

            <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-border/50 rounded-xl p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">Tecnologia de Ponta</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Plataforma moderna e intuitiva que facilita a gestão completa dos seus agendamentos com segurança e
                eficiência.
              </p>
            </div>

            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
          </div>

          <div className="space-y-8 order-1 lg:order-2" data-aos="fade-up-left" data-aos-delay="300">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Conheça a plataforma
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                Sobre a <span className="text-blue-500">ALN<span className="text-white">Barber</span></span>
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                ALNBarber é uma plataforma digital projetada para otimizar a gestão de compromissos e atendimentos. Com
                uma interface intuitiva e ferramentas avançadas, permite agendar, organizar e gerenciar horários de
                maneira prática e eficiente.
              </p>

              <p className="text-base text-muted-foreground leading-relaxed">
                Ideal para diversos segmentos, a Agenda Pro facilita o controle de agendas, a comunicação com clientes e
                a maximização da produtividade, oferecendo uma experiência ágil e organizada para profissionais de
                diversas áreas.
              </p>
            </div>

            <div className="space-y-4 py-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Principais Recursos
              </h3>

              <ul className="space-y-4">
                <li
                  className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50 hover:border-blue-500/50 transition-colors"
                  data-aos="fade-left"
                  data-aos-easing="linear"
                  data-aos-duration="2000"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Agendamento Inteligente</p>
                    <p className="text-sm text-muted-foreground">Sistema automatizado de marcação de horários</p>
                  </div>
                </li>

                <li
                  className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50 hover:border-blue-500/50 transition-colors"
                  data-aos="fade-left"
                  data-aos-easing="linear"
                  data-aos-duration="1500"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Gestão Completa de Agendamentos</p>
                    <p className="text-sm text-muted-foreground">Controle total da sua agenda em um só lugar</p>
                  </div>
                </li>

                <li
                  className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50 hover:border-blue-500/50 transition-colors"
                  data-aos="fade-left"
                  data-aos-easing="linear"
                  data-aos-duration="500"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Customização de Horários</p>
                    <p className="text-sm text-muted-foreground">
                      Defina seus horários de funcionamento com flexibilidade
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleChange}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 px-8 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Comece Agora"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-center">
              <span className="text-blue-500">ALN</span>
              <span>Barber</span>
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Faça login ou crie sua conta com Google
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <Button
              onClick={() => handleLogin("google")}
              variant="outline"
              size="lg"
              className="w-full h-12 gap-3 border-2 hover:bg-accent"
            >
              <FcGoogle className="w-5 h-5" />
              Continuar com Google
            </Button>

            <Button onClick={() => setIsLoginModalOpen(false)} variant="ghost" className="w-full">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
