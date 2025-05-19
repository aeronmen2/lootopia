// components/hunt/HuntCard.tsx
import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Crown, MapPin, Globe } from "lucide-react"
import { Hunt } from "@/lib/types"

interface HuntCardProps {
  hunt: Hunt
  onJoin?: (id: string) => void
  joiningHuntId?: string | null
  disabled?: boolean
  actionSlot?: React.ReactNode
}

export function HuntCard({ hunt, onJoin, joiningHuntId, disabled, actionSlot }: HuntCardProps) {
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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{hunt.title}</CardTitle>
          <Badge variant={hunt.feeCrowns > 0 ? "default" : "secondary"}>
            {hunt.feeCrowns > 0 ? (
              <span className="flex items-center">
                <Crown className="h-3 w-3 mr-1" />
                {hunt.feeCrowns} couronnes
              </span>
            ) : (
              "Gratuit"
            )}
          </Badge>
        </div>
        {hunt.organizerName && (
          <div className="text-sm text-muted-foreground">
            Organisé par {hunt.organizerName}
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm mb-4">{hunt.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            {formatDate(hunt.startDate)}
          </div>
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
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        {actionSlot ? (
          actionSlot
        ) : onJoin ? (
          <Button
            className="w-full"
            disabled={isFull || isPrivate || isJoining || disabled}
            onClick={() => hunt.id && onJoin(hunt.id)}
          >
            {isFull
              ? "Complet"
              : isPrivate
              ? "Privé"
              : isJoining
              ? "Rejoindre..."
              : "Rejoindre cette chasse"}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}