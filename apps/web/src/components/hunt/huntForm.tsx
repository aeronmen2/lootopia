// components/hunt/HuntForm.tsx
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { huntSchema } from "@/lib/types"
import { useCurrentUser } from "@/hooks/query/useAuthQueries"

type HuntFormData = Omit<z.infer<typeof huntSchema>, "organizerId">

interface HuntFormProps {
  initialData: Partial<HuntFormData>
  onSubmit: (data: HuntFormData) => Promise<void>
  submitLabel?: string
}

export function HuntForm({ initialData, onSubmit, submitLabel = "Valider" }: HuntFormProps) {
  const [formData, setFormData] = useState<HuntFormData>({
    title: "",
    description: "",
    worldType: "real",
    mode: "public",
    status: "draft",
    startDate: new Date(),
    feeCrowns: 0,
    chatEnabled: false,
    nbParticipants: 0,
    ...initialData,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { data: user } = useCurrentUser()

  const handleChange = (field: keyof HuntFormData, value: HuntFormData[keyof HuntFormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const validatedData = {
        ...formData,
        organizerId: user?.id,
      }
      huntSchema.parse(validatedData)
      await onSubmit(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) newErrors[err.path[0] as string] = err.message
        })
        setErrors(newErrors)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Titre de la chasse"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Description de la chasse"
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label>Type de monde *</Label>
        <RadioGroup
          value={formData.worldType}
          onValueChange={(value) => handleChange("worldType", value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="real" id="world-real" />
            <Label htmlFor="world-real">Réel</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="map" id="world-map" />
            <Label htmlFor="world-map">Carte</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Mode *</Label>
        <RadioGroup
          value={formData.mode}
          onValueChange={(value) => handleChange("mode", value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="mode-public" />
            <Label htmlFor="mode-public">Public</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="mode-private" />
            <Label htmlFor="mode-private">Privé</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Statut *</Label>
        <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Fermée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Date de début *</Label>
        <Input
          id="startDate"
          type="datetime-local"
          value={new Date(formData.startDate).toISOString().slice(0, 16)}
          onChange={(e) => handleChange("startDate", new Date(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">Date de fin</Label>
        <Input
          id="endDate"
          type="datetime-local"
          value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ""}
          onChange={(e) =>
            handleChange("endDate", e.target.value ? new Date(e.target.value) : undefined)
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxParticipants">Max participants</Label>
        <Input
          id="maxParticipants"
          type="number"
          min="1"
          value={formData.maxParticipants || ""}
          onChange={(e) =>
            handleChange(
              "maxParticipants",
              e.target.value ? Number.parseInt(e.target.value) : undefined,
            )
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="feeCrowns">Coût (Couronnes)</Label>
        <Input
          id="feeCrowns"
          type="number"
          min="0"
          value={formData.feeCrowns}
          onChange={(e) => handleChange("feeCrowns", Number.parseInt(e.target.value))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="chatEnabled"
          checked={formData.chatEnabled}
          onCheckedChange={(checked) => handleChange("chatEnabled", checked)}
        />
        <Label htmlFor="chatEnabled">Activer le chat</Label>
      </div>

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  )
}