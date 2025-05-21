"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ShareButtonProps {
  huntId: string
}

export function ShareButton({ huntId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const url = `${window.location.origin}/hunt/${huntId}`
    navigator.clipboard.writeText(url)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{copied ? "Lien copié !" : "Copier le lien"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
