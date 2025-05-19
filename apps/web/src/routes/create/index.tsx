// routes/create.tsx
import { useRouter, createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HuntForm } from "@/components/hunt/huntForm"
import { useCurrentUser } from "@/hooks/query/useAuthQueries"
import { huntsApi } from "@/api/hunt"
import useToast from "@/hooks/useToast"
import { BackLink } from "@/components/ui/backLink"
import type { z } from "zod"
import { huntSchema } from "@/lib/types"

export const Route = createFileRoute("/create/")({
  component: CreateHunt,
})

type HuntFormData = Omit<z.infer<typeof huntSchema>, "organizerId">

function CreateHunt() {
  const router = useRouter()
  const { data: user } = useCurrentUser()
  const { toast } = useToast()

  const handleSubmit = async (formData: HuntFormData) => {
    if (!user?.id) {
      toast.error({
        title: "Erreur",
        message: "Vous devez être connecté pour créer une chasse.",
        autoClose: 3000,
        position: "top-right",
      })
      return
    }

    try {
      const validatedData = { ...formData, organizerId: user.id }
      huntSchema.parse(validatedData)
      await huntsApi.create(validatedData)

      toast.success({
        title: "Succès !",
        message: "Chasse au trésor créée avec succès !",
        autoClose: 3000,
        position: "top-right",
      })

      router.navigate({ to: "/my-hunts" })
    } catch {
      toast.error({
        title: "Erreur",
        message: "Une erreur est survenue lors de la création.",
        autoClose: 3000,
        position: "top-right",
      })
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <BackLink />
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Créer une nouvelle chasse au trésor</CardTitle>
          </CardHeader>
          <CardContent>
            <HuntForm initialData={{}} onSubmit={handleSubmit} submitLabel="Créer la chasse au trésor" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
