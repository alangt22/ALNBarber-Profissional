"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import logoImg from "../../../../public/alnbarber.png"
import { useState } from "react"

import { FcGoogle } from "react-icons/fc"
import { Loader, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { handleRegister } from "../_actions/login"

export function Hero() {
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
    <section className="relative min-h-[600px] flex items-center py-20 md:mt-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <article className="space-y-8 max-w-2xl">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Plataforma de Agendamentos
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight" data-aos="fade-right">
                Encontre os melhores{" "}
                <span className="text-blue-500 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  profissionais
                </span>{" "}
                em um único local!
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed" data-aos="fade-left">
                Somos uma plataforma dedicada a diversos segmentos, com o objetivo de agilizar o atendimento de forma
                simples, organizada e eficiente.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4" data-aos="zoom-in">
              <Button
                onClick={handleChange}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Cadastre-se agora"}
              </Button>
            </div>
          </article>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse" />
              <Image
                src={logoImg || "/placeholder.svg"}
                alt="Foto ilustrativa de um profissional da saúde"
                width={380}
                height={440}
                className="object-contain relative z-10 drop-shadow-2xl"
                quality={100}
                priority
                data-aos="flip-left"
                data-aos-easing="ease-out-cubic"
                data-aos-duration="2000"
              />
            </div>
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
