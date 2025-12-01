"use client"

import { Button } from "@/components/ui/button"
import { LinkIcon } from "lucide-react"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

export function ButtonCopyLink({ userId }: { userId: string }) {

  async function handleCopyLink() {
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/barbearia/${userId}`)
    toast.success("Link de agendamento copiado com sucesso!")
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={handleCopyLink} className="cursor-pointer">
          <LinkIcon className="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Copiar link</p>
      </TooltipContent>
    </Tooltip>
  )
}
