import { huntsApi } from '@/api/hunt'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { useCurrentUser } from '@/hooks/query/useAuthQueries'
import useToast from '@/hooks/useToast'
import { Hunt } from '@/lib/types'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Badge, ShieldCheck, Calendar, Users, MapPin, Globe, Unlock, Lock as LockIcon, Crown, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/hunt/$huntId')({
  component: RouteComponent,
})

function RouteComponent() {
    const { huntId } = useParams({ from: "/hunt/$huntId" })
    const { toast } = useToast()
    const {data: user} = useCurrentUser()
    const [hunt, setHunt] = useState<Hunt | null>(null)
    const [participants, setParticipants] = useState<Participant[]>([])
    const [isJoining, setIsJoining] = useState(false)
    const [loading, setLoading] = useState(true)

    interface Participant {
        id: string
        name: string
        email: string
      }
  
    useEffect(() => {
      // Fetch hunt data
      const fetchHunt = async () => {
        try {
          setLoading(true)
          const response = await huntsApi.get(huntId)
          const participantsResponse = await huntsApi.getParticipants(huntId)
          setParticipants(participantsResponse.data || [])
          setHunt(response.data)
        } catch (error) {
          console.error("Error fetching hunt:", error)
        } finally {
          setLoading(false)
        }
      }
  
      if (huntId) {
        fetchHunt()
      }
    }, [huntId])
  
    const handleJoinHunt = async (huntId: string) => {
        if (!user?.id) {
          toast.error({
            title: "Erreur",
            message: "Vous devez être connecté pour rejoindre une chasse.",
            autoClose: 3000,
            position: "top-right",
          })
          return
        }
    
        try {
            setIsJoining(true)
          await huntsApi.addParticipant(huntId, user.id)
          toast.success({
            title: "Succès !",
            message: "Vous avez rejoint la chasse avec succès.",
            autoClose: 3000,
            position: "top-right",
          })
        } catch (error) {
          console.error("Failed to join hunt:", error)
          toast.error({
            title: "Erreur",
            message: "Impossible de rejoindre cette chasse.",
            autoClose: 3000,
            position: "top-right",
          })
        } finally {
            setIsJoining(false)
        }
      }
  
    const formatDate = (date: Date) =>
      new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date))
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Chargement de la chasse...</p>
          </div>
        </div>
      )
    }
  
    if (!hunt) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Chasse non trouvée</h1>
            <p className="mb-4">La chasse que vous recherchez n'existe pas ou a été supprimée.</p>
            <Button onClick={() => window.history.back()}>Retour</Button>
          </div>
        </div>
      )
    }
  
    const isFull = hunt.nbParticipants >= (hunt.maxParticipants || 3000)
    const isPrivate = hunt.mode === "private"
    const huntState =
      new Date(hunt.startDate) > new Date()
        ? "à venir"
        : new Date(hunt.endDate || 0) < new Date()
          ? "terminée"
          : "en cours"
  
    const statusColor = hunt.status === "draft" ? "secondary" : hunt.status === "active" ? "default" : "destructive"
  
    return (
      <div className="flex h-screen">
        <div className="w-1/4 p-4 overflow-y-auto border-r">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex flex-col space-y-2">
                <CardTitle className="text-2xl">{hunt.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
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
                {hunt.organizerName && (
                  <div className="text-sm text-muted-foreground">Organisé par {hunt.organizerName}</div>
                )}
              </div>
            </CardHeader>
  
            <CardContent className="space-y-6 flex-grow">
              {hunt.description && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm">{hunt.description}</p>
                </div>
              )}
  
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Détails de la chasse</h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Début: {formatDate(hunt.startDate)}</span>
                  </div>
                  {hunt.endDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Fin: {formatDate(hunt.endDate)}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {hunt.nbParticipants}/{hunt.maxParticipants || "∞"} participants
                    </span>
                  </div>
                  <div className="flex items-center">
                    {hunt.worldType === "real" ? (
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    ) : (
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <span>{hunt.worldType === "real" ? "Monde réel" : "Carte virtuelle"}</span>
                  </div>
                  <div className="flex items-center">
                    {isPrivate ? (
                      <LockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    ) : (
                      <Unlock className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <span>{isPrivate ? "Privée" : "Publique"}</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{hunt.feeCrowns} couronnes</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Chat {hunt.chatEnabled ? "activé" : "désactivé"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
  
            <CardFooter className="pt-4">
            {participants.some(participant => participant.id === user?.id) ? (
                <div className="text-center w-full text-sm text-muted-foreground">
                    Vous êtes dans cette chasse
                </div>
            ) : (
                <Button
                    className="w-full"
                    size="lg"
                    disabled={isFull || isJoining || hunt.status !== "active"}
                    onClick={() => handleJoinHunt(huntId)}
                >
                    {isFull
                        ? "Complet"
                        : hunt.status !== "active"
                            ? hunt.status === "draft"
                                ? "Pas encore disponible"
                                : "Chasse terminée"
                            : isJoining
                                ? "Rejoindre..."
                                : "Rejoindre cette chasse"}
                </Button>
            )}
            </CardFooter>
          </Card>
        </div>
  
        {/* Right panel - Map (3/4 of screen) */}
        <div className="w-3/4 h-full">
        </div>
      </div>
    )
  }
  