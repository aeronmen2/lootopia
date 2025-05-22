// routes/edit/$huntId.tsx
import { useEffect, useState } from "react"
import { useParams, useRouter, createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackLink } from "@/components/ui/backLink"
import { HuntForm } from "@/components/hunt/huntForm"
import { huntsApi } from "@/api/hunt"
import useToast from "@/hooks/useToast"
import { huntSchema } from "@/lib/types"
import type { z } from "zod"
import { useAuth } from "@/hooks/useAuth"

export const Route = createFileRoute("/edit/$huntId")({
  component: EditHunt,
})

type HuntFormData = Omit<z.infer<typeof huntSchema>, "organizerId">

function EditHunt() {
  const { huntId } = useParams({ from: "/edit/$huntId" })
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState<HuntFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHunt() {
      try {
        if (!user?.id) {
          toast.error({
            title: "Erreur",
            message: "Non authentifié.",
            autoClose: 3000,
          })
          return
        }

        const response = await huntsApi.get(huntId)
        const hunt = response.data

        if (hunt.organizerId !== user.id) {
          toast.error({
            title: "Accès refusé",
            message: "Vous n'êtes pas l'organisateur.",
          })
          router.navigate({ to: "/my-hunts" })
          return
        }

        setFormData({
          title: hunt.title,
          description: hunt.description,
          worldType: hunt.worldType,
          mode: hunt.mode,
          status: hunt.status,
          startDate: hunt.startDate,
          endDate: hunt.endDate,
          feeCrowns: hunt.feeCrowns,
          chatEnabled: hunt.chatEnabled,
          maxParticipants: hunt.maxParticipants,
          nbParticipants: hunt.nbParticipants ?? 0,
        })
      } catch {
        toast.error({ title: "Erreur", message: "Chargement impossible." })
      } finally {
        setLoading(false)
      }
    }

    fetchHunt()
  }, [huntId, router, toast, user?.id])

  const handleSubmit = async (data: HuntFormData) => {
    if (!user?.id) return

    try {
      const validatedData = { ...data, organizerId: user.id }
      huntSchema.parse(validatedData)
      await huntsApi.update(huntId, validatedData)

      toast.success({
        title: "Succès",
        message: "Chasse mise à jour avec succès !",
      })
      router.navigate({ to: "/my-hunts" })
    } catch {
      toast.error({ title: "Erreur", message: "Mise à jour impossible." })
    }
  }

  if (loading || !formData)
    return <div className="text-center py-10">Chargement...</div>

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <BackLink to="/my-hunts">Retour</BackLink>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Modifier la chasse au trésor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HuntForm
              initialData={formData}
              onSubmit={handleSubmit}
              submitLabel="Enregistrer les modifications"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
