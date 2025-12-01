"use client"

import { useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogIn, Menu, Sparkles } from "lucide-react"
import { useSession } from "next-auth/react"
import { handleRegister } from "../_actions/login"
import { FcGoogle } from "react-icons/fc"
import Image from "next/image"

export function Header() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const navItens = [{ href: "/", label: "Profissionais" }]

  async function handleLogin(provider: "google") {
    await handleRegister(provider)
    setIsLoginModalOpen(false)
  }

  function handleChange() {
    setIsLoginModalOpen(true)
    setIsOpen(false)
  }

  const NavLinks = () => (
    <>
      {navItens.map((item) => (
        <Button
          onClick={() => setIsOpen(false)}
          key={item.href}
          asChild
          variant="ghost"
          className="text-white hover:bg-white/10 transition-colors"
        >
          <Link href={item.href} className="text-base">
            {item.label}
          </Link>
        </Button>
      ))}

      {status === "loading" ? (
        <div className="h-10 w-32 bg-white/10 animate-pulse rounded-md" />
      ) : session ? (
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all hover:scale-105"
        >
          {session.user?.image && (
            <div className="w-8 h-8 overflow-hidden rounded-full ring-2 ring-white/20">
              <Image
                src={session.user.image || "/placeholder.svg"}
                alt="Foto de Perfil"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          )}
          <span className="text-white font-medium text-sm">Acessar Painel</span>
        </Link>
      ) : (
        <Button
          onClick={handleChange}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white cursor-pointer transition-all hover:scale-105 gap-2"
        >
          <LogIn className="w-4 h-4" />
          Portal da Barbearia
        </Button>
      )}
    </>
  )

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-[#040014]/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-blue-500 hover:scale-105 transition-transform">
            ALN<span className="text-white">Barber</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            <NavLinks />
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                className="text-white hover:bg-white/10 hover:scale-110 cursor-pointer transition-all"
                variant="ghost"
                size="icon"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[280px] sm:w-[320px] z-[9999] py-10 px-7">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-left">Menu</SheetTitle>
                <SheetDescription className="text-left">Veja nossos links</SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col space-y-3 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-white/10">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              <span className="text-blue-500">ALN</span>
              <span className="text-white">Barber</span>
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Faça login ou crie sua conta com Google
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <Button
              onClick={() => handleLogin("google")}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 cursor-pointer font-medium h-11 gap-2"
            >
              <FcGoogle className="w-5 h-5" />
              Continuar com Google
            </Button>

            <Button
              onClick={() => setIsLoginModalOpen(false)}
              variant="outline"
              className="w-full cursor-pointer h-11 border-white/20 hover:bg-white/5"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
