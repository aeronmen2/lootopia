import { huntsApi } from '@/api/hunt'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { useCurrentUser } from '@/hooks/query/useAuthQueries'
import useToast from '@/hooks/useToast'
import { Hunt } from '@/lib/types'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { ShieldCheck, Calendar, Users, MapPin, Globe, Unlock, Lock as LockIcon, Crown, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

// Extended Hunt type with image for mock data
type HuntWithImage = Hunt & {
  imageUrl?: string;
};

// Mock hunt data (same as in hunts-section.tsx)
const MOCK_HUNTS: HuntWithImage[] = [
  {
    id: '1',
    title: 'Caribbean Treasure Hunt',
    description: 'Explore the mysterious islands of the Caribbean in search of ancient pirate treasures. Follow clues left by legendary captains.',
    worldType: 'real',
    mode: 'public',
    status: 'active',
    organizerId: 'organizer1',
    organizerName: 'Captain Morgan',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-30'),
    maxParticipants: 50,
    feeCrowns: 100,
    chatEnabled: true,
    nbParticipants: 23,
    imageUrl: 'https://picsum.photos/seed/caribbean-hunt/400/300',
  },
  {
    id: '2',
    title: 'Temple of Mysteries',
    description: 'Venture into ancient temples filled with puzzles, traps, and hidden artifacts. Only the bravest will succeed.',
    worldType: 'map',
    mode: 'public',
    status: 'active',
    organizerId: 'organizer2',
    organizerName: 'Lady Explorer',
    startDate: new Date('2024-05-15'),
    endDate: new Date('2024-07-15'),
    maxParticipants: 30,
    feeCrowns: 150,
    chatEnabled: true,
    nbParticipants: 18,
    imageUrl: 'https://picsum.photos/seed/temple-hunt/400/300',
  },
  {
    id: '3',
    title: 'Fjord Expedition',
    description: 'Navigate the treacherous fjords of Norway in search of Viking artifacts and ancient runes.',
    worldType: 'real',
    mode: 'public',
    status: 'active',
    organizerId: 'organizer3',
    organizerName: 'Nordic Hunter',
    startDate: new Date('2024-06-10'),
    endDate: new Date('2024-08-10'),
    maxParticipants: 25,
    feeCrowns: 75,
    chatEnabled: false,
    nbParticipants: 12,
    imageUrl: 'https://picsum.photos/seed/fjord-hunt/400/300',
  },
  {
    id: '4',
    title: 'Urban Legend Quest',
    description: 'Investigate urban legends and modern mysteries hidden in plain sight across major cities.',
    worldType: 'real',
    mode: 'private',
    status: 'active',
    organizerId: 'organizer4',
    organizerName: 'City Sleuth',
    startDate: new Date('2024-06-05'),
    endDate: new Date('2024-06-25'),
    maxParticipants: 15,
    feeCrowns: 50,
    chatEnabled: true,
    nbParticipants: 8,
    imageUrl: 'https://picsum.photos/seed/urban-hunt/400/300',
  },
  {
    id: '5',
    title: "Dragon's Lair Challenge",
    description: 'Face mythical creatures and solve ancient riddles in this fantasy-themed adventure through enchanted lands.',
    worldType: 'map',
    mode: 'public',
    status: 'draft',
    organizerId: 'organizer5',
    organizerName: 'Dragon Seeker',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-08-31'),
    maxParticipants: 40,
    feeCrowns: 200,
    chatEnabled: true,
    nbParticipants: 0,
    imageUrl: 'https://picsum.photos/seed/dragon-hunt/400/300',
  },
  {
    id: '6',
    title: 'Crystal Caves Adventure',
    description: 'Explore underground crystal formations and discover rare gems while solving geological puzzles.',
    worldType: 'real',
    mode: 'public',
    status: 'active',
    organizerId: 'organizer6',
    organizerName: 'Crystal Hunter',
    startDate: new Date('2024-05-20'),
    endDate: new Date('2024-07-20'),
    maxParticipants: 20,
    feeCrowns: 125,
    chatEnabled: true,
    nbParticipants: 15,
    imageUrl: 'https://picsum.photos/seed/crystal-hunt/400/300',
  },
  {
    id: '7',
    title: 'Sahara Expedition',
    description: 'Journey across the vast Sahara desert to uncover ancient Egyptian artifacts buried beneath the sands.',
    worldType: 'real',
    mode: 'public',
    status: 'active',
    organizerId: 'organizer7',
    organizerName: 'Pyramid Explorer',
    startDate: new Date('2024-06-15'),
    endDate: new Date('2024-09-15'),
    maxParticipants: 35,
    feeCrowns: 300,
    chatEnabled: false,
    nbParticipants: 22,
    imageUrl: 'https://picsum.photos/seed/sahara-hunt/400/300',
  },
  {
    id: '8',
    title: 'Lunar Temple Hunt',
    description: 'A mystical hunt that follows the phases of the moon, revealing secrets only visible under moonlight.',
    worldType: 'map',
    mode: 'private',
    status: 'active',
    organizerId: 'organizer8',
    organizerName: 'Moon Chaser',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-29'),
    maxParticipants: 12,
    feeCrowns: 175,
    chatEnabled: true,
    nbParticipants: 7,
    imageUrl: 'https://picsum.photos/seed/lunar-hunt/400/300',
  },
];

export const Route = createFileRoute('/hunt/$huntId')({
  component: RouteComponent,
})

function RouteComponent() {
    const { huntId } = useParams({ from: "/hunt/$huntId" })
    const { toast } = useToast()
    const {data: user} = useCurrentUser()
    const [hunt, setHunt] = useState<HuntWithImage | null>(null)
    const [participants, setParticipants] = useState<Participant[]>([])
    const [isJoining, setIsJoining] = useState(false)
    const [loading, setLoading] = useState(true)

    interface Participant {
        id: string
        name: string
        email: string
      }
  
    useEffect(() => {
      // First try to find hunt in mock data
      const fetchHunt = async () => {
        try {
          setLoading(true)
          
          // Check if hunt exists in mock data
          const mockHunt = MOCK_HUNTS.find(h => h.id === huntId)
          
          if (mockHunt) {
            // Use mock data
            setHunt(mockHunt)
            // Mock participants data
            const mockParticipants: Participant[] = [
              { id: 'user1', name: 'John Doe', email: 'john@example.com' },
              { id: 'user2', name: 'Jane Smith', email: 'jane@example.com' },
            ]
            setParticipants(mockParticipants)
          } else {
            // Fallback to API call for real hunts
            const response = await huntsApi.get(huntId)
            const participantsResponse = await huntsApi.getParticipants(huntId)
            setParticipants(participantsResponse.data || [])
            setHunt(response.data)
          }
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
            
            // Check if this is a mock hunt
            const mockHunt = MOCK_HUNTS.find(h => h.id === huntId)
            
            if (mockHunt) {
              // Simulate joining mock hunt
              await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
              
              // Add current user to participants
              const newParticipant: Participant = {
                id: user.id,
                name: user.name || 'Current User',
                email: user.email || 'user@example.com'
              }
              setParticipants(prev => [...prev, newParticipant])
              
              // Update hunt participant count
              setHunt(prev => prev ? { ...prev, nbParticipants: prev.nbParticipants + 1 } : null)
              
              toast.success({
                title: "Succès !",
                message: "Vous avez rejoint la chasse avec succès.",
                autoClose: 3000,
                position: "top-right",
              })
            } else {
              // Use real API for non-mock hunts
              await huntsApi.addParticipant(huntId, user.id)
              toast.success({
                title: "Succès !",
                message: "Vous avez rejoint la chasse avec succès.",
                autoClose: 3000,
                position: "top-right",
              })
            }
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
        <div className="flex items-center justify-center h-screen pt-20">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Chargement de la chasse...</p>
          </div>
        </div>
      )
    }
  
    if (!hunt) {
      return (
        <div className="flex items-center justify-center h-screen pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Chasse non trouvée</h1>
            <p className="mb-4">La chasse que vous recherchez n'existe pas ou a été supprimée.</p>
            <Button onClick={() => window.history.back()} className="rounded-xl">Retour</Button>
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
      <div className="flex h-screen pt-20">
        <div className="w-1/4 p-4 overflow-y-auto border-r">
          <Card className="h-full flex flex-col rounded-xl">
            <CardHeader>
              {hunt.imageUrl && (
                <div className="mb-4 -mx-6 -mt-6">
                  <img
                    src={hunt.imageUrl}
                    alt={hunt.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
              )}
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
                    className="w-full rounded-xl"
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
  
        {/* Right panel - Hunt Details & Map (3/4 of screen) */}
        <div className="w-3/4 h-full flex flex-col">
          {/* Hunt Image Hero Section */}
          {hunt.imageUrl && (
            <div className="h-64 relative overflow-hidden rounded-xl">
              <img
                src={hunt.imageUrl}
                alt={hunt.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{hunt.title}</h1>
                  <p className="text-lg opacity-90">{hunt.description}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Content Area */}
          <div className="flex-1 p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Hunt Rules & Guidelines */}
                <Card className="rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Hunt Rules & Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Follow all local laws and regulations
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Respect private property and environment
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Work in teams or individually as specified
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Use the app to log discoveries and progress
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Be respectful to other participants
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Participants List */}
                <Card className="rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Participants ({participants.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {participants.length > 0 ? (
                        participants.map((participant) => (
                          <div key={participant.id} className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {participant.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm">{participant.name}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No participants yet. Be the first to join!</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Map or Additional Content Area */}
              <Card className="h-64 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {hunt.worldType === 'real' ? 'Hunt Area Map' : 'Virtual World Map'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {hunt.worldType === 'real' 
                        ? 'Interactive map showing hunt locations will be displayed here'
                        : 'Virtual world map with quest markers will be shown here'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
  