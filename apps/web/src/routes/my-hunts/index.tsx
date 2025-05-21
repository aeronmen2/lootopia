"use client"

import { useState, useEffect } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { BackLink } from "@/components/ui/backLink"
import { ParticipantDialog } from "@/components/hunt/participantDialog"
import { huntsApi } from "@/api/hunt"
import { useCurrentUser } from "@/hooks/query/useAuthQueries"
import useToast from "@/hooks/useToast"
import { Button } from "@/components/ui/button"
import { Users, Pencil, Trash2, LogOutIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Hunt } from "@/lib/types"
import { HuntList } from "@/components/hunt/huntList"
import { ShareButton } from "@/components/hunt/ShareButton"

export const Route = createFileRoute("/my-hunts/")({
  component: MyHunts,
})

function MyHunts() {
  const { data: user } = useCurrentUser()
  const { toast } = useToast()
  const [createdHunts, setCreatedHunts] = useState<Hunt[]>()
  const [joinedHunts, setJoinedHunts] = useState<Hunt[]>()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentHuntId, setCurrentHuntId] = useState<string | null>(null)
  const [participantsOpen, setParticipantsOpen] = useState(false)
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false)

  useEffect(() => {
    async function fetch() {
      try {
        const created = await huntsApi.getByUserId(user?.id || "")
        const joined = await huntsApi.getByParticipantId(user?.id || "")
        setCreatedHunts(created.data || [])
        setJoinedHunts(joined.data || [])
      } catch {
        toast.error({ title: "Erreur", message: "Chargement des chasses impossible." })
      }
    }
    fetch()
  }, [toast, user?.id])

  interface Participant {
    id: string
    name: string
    email: string
  }

  const handleParticipantsClick = async (huntId: string): Promise<void> => {
    setCurrentHuntId(huntId)
    setParticipantsOpen(true)
    setIsLoadingParticipants(true)

    try {
      const res = await huntsApi.getParticipants(huntId)
      setParticipants((res.data || []) as Participant[])
    } catch {
      toast.error({ title: "Erreur", message: "Chargement des participants impossible." })
    } finally {
      setIsLoadingParticipants(false)
    }
  }

  const handleDeleteParticipant = async (participantId: string) => {
    if (!currentHuntId) return

    try {
      await huntsApi.deleteParticipant(currentHuntId, participantId)
      setParticipants((prev) => prev.filter((p) => p.id !== participantId))
      toast.success({ title: "Succès", message: "Participant supprimé." })
    } catch {
      toast.error({ title: "Erreur", message: "Suppression impossible." })
    }
  }

  const renderCreatedActions = (hunt: Hunt) => (
    <div className="flex space-x-2 w-full justify-end">
      {hunt.id && <ShareButton huntId={hunt.id} />}

      <Button variant="outline" size="icon" onClick={() => hunt.id && handleParticipantsClick(hunt.id)}>
        <Users className="h-4 w-4" />
      </Button>
      <Button asChild variant="outline" size="icon">
        <Link to="/edit/$huntId" params={{ huntId: hunt.id ?? "" }}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="text-red-500 hover:text-red-700"
        onClick={async () => {
          try {
            if (hunt.id) {
              await huntsApi.delete(hunt.id)
            } else {
              toast.error({ title: "Erreur", message: "ID de chasse manquant." })
            }
            setCreatedHunts((prev) => (prev || []).filter((h) => h.id !== hunt.id))
            toast.success({ title: "Succès", message: "Chasse supprimée." })
          } catch {
            toast.error({ title: "Erreur", message: "Suppression impossible." })
          }
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  const renderJoinedActions = (hunt: Hunt) => (
    <div className="flex space-x-2 w-full justify-end">
      <Badge variant={hunt.feeCrowns > 0 ? "default" : "secondary"}>
        {hunt.feeCrowns > 0 ? `${hunt.feeCrowns} couronnes` : "Gratuit"}
      </Badge>
      <Button
        variant="outline"
        size="icon"
        className="text-red-500 hover:text-red-700"
        onClick={async () => {
          try {
            await huntsApi.deleteParticipant(hunt.id, user?.id)
            setJoinedHunts((prev) => (prev || []).filter((h) => h.id !== hunt.id))
            toast.success({ title: "Succès", message: "Chasse quittée." })
          } catch {
            toast.error({ title: "Erreur", message: "Quitter la chasse a échoué." })
          }
        }}
      >
        <LogOutIcon className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <BackLink />
        <h1 className="text-3xl font-bold mb-6">Mes chasses au trésor</h1>

        <Tabs defaultValue="created" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="created">Chasses créées</TabsTrigger>
            <TabsTrigger value="joined">Chasses rejointes</TabsTrigger>
          </TabsList>

          <TabsContent value="created">
            <div className="mb-10">
              <HuntList
                hunts={createdHunts || []}
                title="Chasses créées"
                emptyMessage="Vous n'avez pas encore créé de chasse."
                renderActions={renderCreatedActions}
              />
            </div>
          </TabsContent>
          <TabsContent value="joined">
            <div>
              <HuntList
                hunts={joinedHunts || []}
                title="Chasses rejointes"
                emptyMessage="Vous n'avez pas encore rejoint de chasse."
                renderActions={renderJoinedActions}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ParticipantDialog
        open={participantsOpen}
        onOpenChange={setParticipantsOpen}
        participants={participants}
        isLoading={isLoadingParticipants}
        onDeleteParticipant={handleDeleteParticipant}
      />
    </div>
  )
}
