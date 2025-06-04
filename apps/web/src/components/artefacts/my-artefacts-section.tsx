import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock personal artefact data - these are owned by the user
type PersonalArtefact = {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageUrl?: string;
  discoveredBy: string;
  hunt: string;
  discoveryDate: string;
  acquiredDate: string;
  acquiredPrice?: number;
  salePrice?: number;
  ownershipHistory: Array<{
    owner: string;
    date: string;
    price?: number;
    action: 'discovered' | 'purchased' | 'traded';
  }>;
  isForSale?: boolean;
};

const MY_ARTEFACTS: PersonalArtefact[] = [
  {
    id: '1',
    name: 'Ancient Golden Compass',
    description:
      'A mystical compass that always points to the nearest treasure. Crafted by ancient navigators.',
    rarity: 'legendary',
    imageUrl: 'https://picsum.photos/seed/myitem1/500/400',
    discoveredBy: 'Captain Morgan',
    hunt: 'Caribbean Treasure Hunt',
    discoveryDate: '2024-01-15',
    acquiredDate: '2024-01-15',
    salePrice: 350,
    ownershipHistory: [
      { owner: 'Captain Morgan', date: '2024-01-15', action: 'discovered' },
    ],
  },
  {
    id: '2',
    name: 'Crystal Healing Pendant',
    description:
      'A translucent crystal pendant that seems to pulse with healing energy.',
    rarity: 'epic',
    imageUrl: 'https://picsum.photos/seed/myitem2/500/400',
    discoveredBy: 'You',
    hunt: 'Crystal Caves Adventure',
    discoveryDate: '2024-02-15',
    acquiredDate: '2024-02-15',
    salePrice: 120,
    ownershipHistory: [
      { owner: 'You', date: '2024-02-15', action: 'discovered' },
    ],
  },
  {
    id: '3',
    name: 'Viking War Horn',
    description:
      'An ancient horn used to rally Viking warriors. Still echoes with the spirits of the past.',
    rarity: 'rare',
    imageUrl: 'https://picsum.photos/seed/myitem3/500/400',
    discoveredBy: 'Nordic Hunter',
    hunt: 'Fjord Expedition',
    discoveryDate: '2024-01-28',
    acquiredDate: '2024-02-05',
    acquiredPrice: 150,
    salePrice: 90,
    ownershipHistory: [
      { owner: 'Nordic Hunter', date: '2024-01-28', action: 'discovered' },
      { owner: 'You', date: '2024-02-05', price: 150, action: 'purchased' },
    ],
  },
  {
    id: '4',
    name: 'Weathered Treasure Map',
    description:
      'An old map showing the location of several buried treasures. Some locations already discovered.',
    rarity: 'common',
    imageUrl: 'https://picsum.photos/seed/myitem4/500/400',
    discoveredBy: 'Map Collector',
    hunt: 'Library Investigation',
    discoveryDate: '2024-02-28',
    acquiredDate: '2024-03-02',
    acquiredPrice: 50,
    salePrice: 30,
    ownershipHistory: [
      { owner: 'Map Collector', date: '2024-02-28', action: 'discovered' },
      { owner: 'You', date: '2024-03-02', price: 50, action: 'purchased' },
    ],
  },
  {
    id: '5',
    name: 'Emerald Dragon Eye',
    description:
      "A massive emerald carved in the shape of a dragon's eye. Radiates mystical energy.",
    rarity: 'legendary',
    imageUrl: 'https://picsum.photos/seed/myitem5/500/400',
    discoveredBy: 'You',
    hunt: 'Mountain Cave Quest',
    discoveryDate: '2024-01-20',
    acquiredDate: '2024-01-20',
    salePrice: 500,
    ownershipHistory: [
      { owner: 'You', date: '2024-01-20', action: 'discovered' },
    ],
  },
  {
    id: '6',
    name: 'Silver Moon Amulet',
    description:
      'A silver amulet that changes color with the phases of the moon.',
    rarity: 'rare',
    imageUrl: 'https://picsum.photos/seed/myitem6/500/400',
    discoveredBy: 'You',
    hunt: 'Lunar Temple Hunt',
    discoveryDate: '2024-03-05',
    acquiredDate: '2024-03-05',
    salePrice: 60,
    ownershipHistory: [
      { owner: 'You', date: '2024-03-05', action: 'discovered' },
    ],
  },
];

export default function MyArtefactsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtefact, setSelectedArtefact] =
    useState<PersonalArtefact | null>(null);
  const [artefacts, setArtefacts] = useState(MY_ARTEFACTS);
  const [sellingId, setSellingId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [artefactToSell, setArtefactToSell] = useState<PersonalArtefact | null>(
    null
  );
  const FIXED_PRICE = 100; // prix fixe pour la vente
  const itemsPerPage = 9;

  const rarityColors = {
    common: 'bg-gray-100 text-gray-800 border-gray-300',
    rare: 'bg-blue-100 text-blue-800 border-blue-300',
    epic: 'bg-purple-100 text-purple-800 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  // Filter artefacts based on search and rarity
  const filteredArtefacts = artefacts.filter((artefact) => {
    const matchesSearch =
      artefact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artefact.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity =
      rarityFilter === 'all' || artefact.rarity === rarityFilter;

    return matchesSearch && matchesRarity;
  });

  // Paginate results
  const totalPages = Math.ceil(filteredArtefacts.length / itemsPerPage);
  const paginatedArtefacts = filteredArtefacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Ajout de la fonction de vente
  const handleSell = (id: string) => {
    setArtefacts((prev) => prev.filter((a) => a.id !== id));
    setSellingId(null);
    setConfirmDialogOpen(false);
    setArtefactToSell(null);
  };

  return (
    <section className="relative h-screen pt-20 bg-white overflow-hidden">
      <div className="relative z-10 h-full flex">
        {/* Left Sidebar - Filters */}
        <div className="w-80 border-r border-gray-200 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            My Collection
          </h2>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              Collection Stats
            </h3>
            <div className="space-y-1 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-medium">{MY_ARTEFACTS.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Discovered by You:</span>
                <span className="font-medium">
                  {MY_ARTEFACTS.filter((a) => a.discoveredBy === 'You').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Purchased:</span>
                <span className="font-medium">
                  {MY_ARTEFACTS.filter((a) => a.acquiredPrice).length}
                </span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <Input
              placeholder="Search your artefacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10"
            />
          </div>

          {/* Rarity Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rarity
            </label>
            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Filter by rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredArtefacts.length} of {MY_ARTEFACTS.length}{' '}
            artefacts
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Scrollable Cards Grid */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-3 gap-8">
              {paginatedArtefacts.map((artefact) => (
                <Card
                  key={artefact.id}
                  className="cursor-pointer transition-all duration-300 bg-white border border-gray-200 hover:border-gray-300 hover:scale-105 hover:shadow-2xl shadow-lg group rounded-xl overflow-hidden"
                >
                  <CardHeader className="relative pb-3">
                    {artefact.imageUrl && (
                      <div className="mb-3 -mx-6 -mt-6">
                        <img
                          src={artefact.imageUrl}
                          alt={artefact.name}
                          className="w-full h-56 object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${rarityColors[artefact.rarity]}`}
                      >
                        {artefact.rarity.toUpperCase()}
                      </span>
                      {artefact.discoveredBy === 'You' && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                          DISCOVERED
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-base text-gray-900 group-hover:text-black transition-colors">
                      {artefact.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-xs line-clamp-2">
                      {artefact.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Acquired:</span>
                        <span className="text-gray-900 font-medium">
                          {formatDate(artefact.acquiredDate)}
                        </span>
                      </div>
                      {artefact.acquiredPrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Paid:</span>
                          <span className="text-gray-900 font-medium">
                            👑 {artefact.acquiredPrice}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">From hunt:</span>
                        <span className="text-gray-900 font-medium truncate ml-2">
                          {artefact.hunt}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4 flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs hover:bg-gray-50"
                          onClick={() => setSelectedArtefact(artefact)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl">
                            {selectedArtefact?.name}
                          </DialogTitle>
                          <DialogDescription>
                            Detailed information about this artefact
                          </DialogDescription>
                        </DialogHeader>
                        {selectedArtefact && (
                          <div className="space-y-4">
                            {selectedArtefact.imageUrl && (
                              <img
                                src={selectedArtefact.imageUrl}
                                alt={selectedArtefact.name}
                                className="w-full h-64 object-cover rounded-lg"
                              />
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  Basic Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">
                                      Rarity:
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                        rarityColors[selectedArtefact.rarity]
                                      }`}
                                    >
                                      {selectedArtefact.rarity.toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">
                                      Discovered by:
                                    </span>
                                    <span className="text-gray-900">
                                      {selectedArtefact.discoveredBy}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Hunt:</span>
                                    <span className="text-gray-900">
                                      {selectedArtefact.hunt}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">
                                      Discovery Date:
                                    </span>
                                    <span className="text-gray-900">
                                      {formatDate(
                                        selectedArtefact.discoveryDate
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  Ownership History
                                </h4>
                                <div className="space-y-2">
                                  {selectedArtefact.ownershipHistory.map(
                                    (entry, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                      >
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">
                                            {entry.owner}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {entry.action} -{' '}
                                            {formatDate(entry.date)}
                                          </div>
                                        </div>
                                        {entry.price && (
                                          <div className="text-sm font-bold text-gray-900">
                                            👑 {entry.price}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">
                                Description
                              </h4>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {selectedArtefact.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      className="w-full bg-black text-white hover:bg-gray-800 text-xs"
                      onClick={() => {
                        setArtefactToSell(artefact);
                        setConfirmDialogOpen(true);
                      }}
                    >
                      {`Vendre cet artefact pour 👑 ${artefact.salePrice ?? FIXED_PRICE}`}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          {/* Dialog de confirmation de vente */}
          <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  Êtes-vous sûr de vouloir vendre cet artefact ?
                </DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. L'artefact sera vendu pour un
                  prix fixe de 👑 {FIXED_PRICE} et disparaîtra de votre
                  collection.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 mt-4">
                <Button
                  className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  variant="outline"
                  onClick={() => setConfirmDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  onClick={() =>
                    artefactToSell && handleSell(artefactToSell.id)
                  }
                >
                  Confirmer la vente
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-8 py-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex-1 bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex-1 bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
