import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useToast from "@/hooks/useToast"
import { useBalance } from "@/hooks/query/useBalanceQuery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute("/dashboard/marketplace")({
  component: MarketplacePage,
})

const MARKETPLACE_ITEMS = [
  {
    id: "premium_hunt",
    name: "Chasse premium",
    description:
      "Créez une chasse au trésor premium avec plus d'options et de récompenses.",
    price: 100,
    category: "features",
    image: "🎯",
  },
  {
    id: "special_badge",
    name: "Badge spécial",
    description: "Un badge exclusif pour votre profil.",
    price: 50,
    category: "cosmetics",
    image: "🏅",
  },
  {
    id: "hunt_boost",
    name: "Boost de chasse",
    description: "Augmentez vos gains lors de la prochaine chasse au trésor.",
    price: 75,
    category: "boosts",
    image: "⚡️",
  },
  {
    id: "custom_theme",
    name: "Thème personnalisé",
    description: "Personnalisez l'apparence de votre profil.",
    price: 150,
    category: "cosmetics",
    image: "🎨",
  },
  {
    id: "mega_boost",
    name: "Méga boost",
    description: "Triple vos gains pendant 24 heures.",
    price: 200,
    category: "boosts",
    image: "🚀",
  },
]

const ITEMS_PER_PAGE = 6

function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">(
    "name",
  )
  const { toast } = useToast()
  const { data: userBalance = 0 } = useBalance()

  // Filter and sort items
  const filteredItems = MARKETPLACE_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "name":
      default:
        return a.name.localeCompare(b.name)
    }
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handlePurchase = (item: (typeof MARKETPLACE_ITEMS)[0]) => {
    if (userBalance < item.price) {
      toast.error({
        title: "Solde insuffisant",
        message: "Vous n'avez pas assez de couronnes pour cet achat.",
      })
      return
    }

    toast.success({
      title: "Achat effectué",
      message: `Vous avez acheté ${item.name} pour ${item.price} couronnes.`,
    })
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Marché</h1>
          <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200 flex items-center">
            <span className="text-sm text-gray-600 mr-2">Votre solde:</span>
            <div className="flex items-center">
              <span className="font-bold text-lg">{userBalance}</span>
              <svg
                className="h-4 w-4 ml-1 text-yellow-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full"
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value: typeof sortBy) => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Tabs
          defaultValue="all"
          className="mb-8"
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value)
            setCurrentPage(1)
          }}
        >
          <TabsList>
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
            <TabsTrigger value="cosmetics">Cosmétiques</TabsTrigger>
            <TabsTrigger value="boosts">Boosts</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {paginatedItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun article ne correspond à votre recherche
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedItems.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <span className="text-3xl">{item.image}</span>
                            {item.name}
                          </CardTitle>
                        </div>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold">
                            {item.price}
                          </span>
                          <svg
                            className="h-5 w-5 ml-1 text-yellow-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() => handlePurchase(item)}
                          disabled={userBalance < item.price}
                        >
                          {userBalance < item.price
                            ? "Solde insuffisant"
                            : "Acheter"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    <div className="flex items-center gap-2 px-4">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ),
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
