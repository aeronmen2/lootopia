import { useState, useEffect } from "react"
import { huntsApi } from "@/api/hunt"
import { Hunt } from "@/lib/types"
import { useCurrentUser } from "@/hooks/query/useAuthQueries"
import useToast from "@/hooks/useToast"
import { HuntList } from "@/components/hunt/huntList"
import { BackLink } from "@/components/ui/backLink"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/join/")({
  component: JoinHunt,
})

function JoinHunt() {
  const [availableHunts, setAvailableHunts] = useState<Hunt[]>([])
  const [joiningHuntId, setJoiningHuntId] = useState<string | null>(null)
  const { data: user } = useCurrentUser()
  const { toast } = useToast()

  useEffect(() => {
    const fetchHunts = async () => {
      try {
        const Hunts = await huntsApi.list()
        setAvailableHunts(Hunts.data || [])
      } catch (error) {
        console.error("Failed to fetch hunts:", error)
      }
    }
    fetchHunts()
  }, [])

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
      setJoiningHuntId(huntId)
      await huntsApi.addParticipant(huntId, user.id)
      toast.success({
        title: "Succès !",
        message: "Vous avez rejoint la chasse avec succès.",
        autoClose: 3000,
        position: "top-right",
      })

      setAvailableHunts((prev) =>
        prev.map((hunt) =>
          hunt.id === huntId
            ? { ...hunt, nbParticipants: (hunt.nbParticipants || 0) + 1 }
            : hunt
        )
      )
    } catch (error) {
      console.error("Failed to join hunt:", error)
      toast.error({
        title: "Erreur",
        message: "Impossible de rejoindre cette chasse.",
        autoClose: 3000,
        position: "top-right",
      })
    } finally {
      setJoiningHuntId(null)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <BackLink />

        <h1 className="text-3xl font-bold mb-6">Chasses disponibles</h1>

        <HuntList
          title="Liste des chasses"
          emptyMessage="Aucune chasse disponible pour le moment."
          hunts={availableHunts}
          joiningHuntId={joiningHuntId}
          onJoin={handleJoinHunt}
        />
      </div>
    </div>
  )
}
