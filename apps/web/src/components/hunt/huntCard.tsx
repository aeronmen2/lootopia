"use client"

import type React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Crown, MapPin, Globe, Lock, Unlock, MessageCircle, ShieldCheck } from "lucide-react"
import type { Hunt } from "@/lib/types"
import { useNavigate } from "@tanstack/react-router"

interface HuntCardProps {
  hunt: Hunt
  onJoin?: (id: string) => void
  joiningHuntId?: string | null
  disabled?: boolean
  actionSlot?: React.ReactNode
}

export function HuntCard({ hunt, onJoin, joiningHuntId, disabled, actionSlot }: HuntCardProps) {
  const navigate = useNavigate()

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))

  const isFull = hunt.nbParticipants >= (hunt.maxParticipants || 3000)
  const isPrivate = hunt.mode === "private"
  const isJoining = joiningHuntId === hunt.id
  const huntState =
    new Date(hunt.startDate) > new Date()
      ? "à venir"
      : new Date(hunt.endDate || 0) < new Date()
        ? "terminée"
        : "en cours"

  const statusColor = hunt.status === "draft" ? "secondary" : hunt.status === "active" ? "default" : "destructive"

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on a button or other interactive element
    if (
      e.target instanceof HTMLElement &&
      (e.target.closest("button") || e.target.closest("a") || e.target.tagName === "BUTTON" || e.target.tagName === "A")
    ) {
      return
    }

    if (hunt.id) {
      navigate({ to: `/hunt/${hunt.id}` })
    }
  }

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{hunt.title}</CardTitle>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant={statusColor}>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                {hunt.status}
              </span>
            </Badge>
            <Badge
              variant={huntState === "à venir" ? "secondary" : huntState === "en cours" ? "default" : "destructive"}
            >
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {huntState}
              </span>
            </Badge>
          </div>
        </div>
        {hunt.organizerName && <div className="text-sm text-muted-foreground">Organisé par {hunt.organizerName}</div>}
      </CardHeader>

      <CardContent className="pb-2 space-y-4">
        {hunt.description && <p className="text-sm">{hunt.description}</p>}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            {formatDate(hunt.startDate)}
          </div>
          {hunt.endDate && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              Jusqu'au {formatDate(hunt.endDate)}
            </div>
          )}
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            {hunt.nbParticipants}/{hunt.maxParticipants || "∞"} participants
          </div>
          <div className="flex items-center">
            {hunt.worldType === "real" ? (
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            ) : (
              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            {hunt.worldType === "real" ? "Monde réel" : "Carte virtuelle"}
          </div>
          <div className="flex items-center">
            {isPrivate ? (
              <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
            ) : (
              <Unlock className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            {isPrivate ? "Privée" : "Publique"}
          </div>
          <div className="flex items-center">
            <Crown className="h-4 w-4 mr-2 text-muted-foreground" />
            {hunt.feeCrowns} couronnes
          </div>
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground" />
            Chat {hunt.chatEnabled ? "activé" : "désactivé"}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        {actionSlot ? (
          actionSlot
        ) : onJoin ? (
          <Button
            className="w-full"
            disabled={isFull || isPrivate || isJoining || disabled}
            onClick={(e) => {
              e.stopPropagation() // Prevent card click when button is clicked
              if (hunt.id) {
                onJoin(hunt.id)
              }
            }}
          >
            {isFull ? "Complet" : isPrivate ? "Privé" : isJoining ? "Rejoindre..." : "Rejoindre cette chasse"}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
