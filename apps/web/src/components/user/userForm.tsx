"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { userSchema } from "@/lib/types"
import { Loader2, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import useToast from "@/hooks/useToast"
import { authApi } from "@/api/auth"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

type ProfileFormProps = {
  section: "general" | "contact" | "security"
}

export function UserForm({ section }: ProfileFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function handleDeleteAccount() {
    if (!user || !("id" in user)) return
    try {
      await authApi.logout()
      await authApi.delete(user.id)
      setIsModalOpen(false)
      toast.success({
        title: "Succès",
        message: "Compte supprimé avec succès !",
      })
      router.navigate({ to: "/login" })
    } catch {
      toast.error({
        title: "Erreur",
        message: "Impossible de supprimer le compte.",
      })
    }
  }

  // Create a form schema based on the section
  const getFormSchema = () => {
    if (section === "general") {
      return userSchema.pick({
        name: true,
        lastname: true,
        username: true,
        bio: true,
        website: true,
        photoUrl: true,
      })
    } else if (section === "contact") {
      return userSchema.pick({
        email: true,
        phoneNumber: true,
        country: true,
        region: true,
        city: true,
        address: true,
      })
    } else {
      return userSchema.pick({
        email: true,
        emailVerified: true,
      })
    }
  }

  const formSchema = getFormSchema()
  type FormValues = z.infer<typeof formSchema>

  // Get the default values for the form based on the section
  const getDefaultValues = () => {
    if (section === "general") {
      return {
        name: user?.name || "",
        lastname: user?.lastname || "",
        username: user?.username || "",
        bio: user?.bio || "",
        website: user?.website || "",
        photoUrl: user?.photoUrl || "",
      }
    } else if (section === "contact") {
      return {
        email: user?.email ?? "",
        phoneNumber: user?.phoneNumber ?? "",
        country: user?.country ?? "",
        region: user?.region ?? "",
        city: user?.city ?? "",
        address: user?.address ?? "",
      }
    } else {
      return {
        email: user?.email ?? "",
        emailVerified: user?.emailVerified ?? "",
      }
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    if (!user || !("id" in user)) return

    try {
      await authApi.update(user.id, data)

      toast.success({
        title: "Succès",
        message: "Profile mis à jour avec succès !",
      })
      setIsSuccess(true)
    } catch {
      toast.error({ title: "Erreur", message: "Mise à jour impossible." })
    }

    setIsSubmitting(false)

    // Reset success message after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Validation failed:", errors)
        })}
        className="space-y-6"
      >
        {section === "general" && user && (
          <>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Card className="p-4 border border-dashed flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={user.photoUrl || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0)}
                      {user.lastname?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Changer la photo
                  </Button>
                </div>
              </Card>

              <div className="grid gap-4 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Votre nom d'utilisateur"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Votre nom d'utilisateur unique sur la plateforme.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biographie</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Parlez-nous de vous..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Maximum 500 caractères.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input placeholder="https://votre-site.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {section === "contact" && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+33612345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input placeholder="Pays" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Région</FormLabel>
                    <FormControl>
                      <Input placeholder="Région" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        {section === "security" && user && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="votre@email.com" {...field} />
                    </FormControl>
                    {user.emailVerified && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm">Vérifié</span>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!user.emailVerified && (
              <Button variant="outline" type="button">
                Renvoyer l'email de vérification
              </Button>
            )}

            <div className="pt-4">
              <h3 className="font-medium mb-2">Sécurité du compte</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-start"
                >
                  Changer le mot de passe
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-start"
                >
                  Activer l'authentification à deux facteurs
                </Button>
                <Button
                  variant="destructive"
                  type="button"
                  className="w-full justify-start"
                  onClick={() => setIsModalOpen(true)}
                >
                  Supprimer le compte
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-4">
          {isSuccess && (
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Modifications enregistrées
            </p>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action
                est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}
