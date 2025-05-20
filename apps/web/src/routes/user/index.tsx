import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserForm } from "@/components/user/userForm"
import { BackLink } from "@/components/ui/backLink"

export const Route = createFileRoute('/user/')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
    <div className="container mx-auto py-10 px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <BackLink />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
              <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences.</p>
            </div>
            <Separator />
    
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
              </TabsList>
    
              <TabsContent value="general" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                    <CardDescription>Mettez à jour vos informations personnelles.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserForm section="general" />
                  </CardContent>
                </Card>
              </TabsContent>
    
              <TabsContent value="contact" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Coordonnées et localisation</CardTitle>
                    <CardDescription>Gérez vos informations de contact et votre adresse.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserForm section="contact" />
                  </CardContent>
                </Card>
              </TabsContent>
    
              <TabsContent value="security" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité et vérification</CardTitle>
                    <CardDescription>Gérez les paramètres de sécurité de votre compte.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserForm section="security" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )
}
