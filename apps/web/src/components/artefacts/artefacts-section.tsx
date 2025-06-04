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

// Mock artefact data
type Artefact = {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageUrl?: string;
  discoveredBy: string;
  hunt: string;
  discoveryDate: string;
  currentOwner: string;
  price?: number;
  isForSale: boolean;
  ownershipHistory: Array<{
    owner: string;
    date: string;
    price?: number;
    action: 'discovered' | 'purchased' | 'traded';
  }>;
};

const MOCK_ARTEFACTS: Artefact[] = [
  {
    id: '1',
    name: 'Ancient Golden Compass',
    description:
      'A mystical compass that always points to the nearest treasure. Crafted by ancient navigators.',
    rarity: 'legendary',
    imageUrl: 'https://picsum.photos/seed/marketplace1/400/300',
    discoveredBy: 'Captain Morgan',
    hunt: 'Caribbean Treasure Hunt',
    discoveryDate: '2024-01-15',
    currentOwner: 'Captain Morgan',
    price: 500,
    isForSale: true,
    ownershipHistory: [
      { owner: 'Captain Morgan', date: '2024-01-15', action: 'discovered' },
    ],
  },
  {
    id: '2',
    name: 'Ruby of the Lost Temple',
    description:
      'A brilliant red ruby that glows in moonlight. Said to hold the power of ancient priests.',
    rarity: 'epic',
    imageUrl: 'https://picsum.photos/seed/marketplace2/400/300',
    discoveredBy: 'Lady Explorer',
    hunt: 'Temple of Mysteries',
    discoveryDate: '2024-02-03',
    currentOwner: 'Treasure Collector',
    price: 300,
    isForSale: false,
    ownershipHistory: [
      { owner: 'Lady Explorer', date: '2024-02-03', action: 'discovered' },
      {
        owner: 'Treasure Collector',
        date: '2024-02-10',
        price: 250,
        action: 'purchased',
      },
    ],
  },
  {
    id: '3',
    name: 'Viking War Horn',
    description:
      'An ancient horn used to rally Viking warriors. Still echoes with the spirits of the past.',
    rarity: 'rare',
    imageUrl: 'https://picsum.photos/seed/marketplace3/400/300',
    discoveredBy: 'Nordic Hunter',
    hunt: 'Fjord Expedition',
    discoveryDate: '2024-01-28',
    currentOwner: 'Nordic Hunter',
    price: 150,
    isForSale: true,
    ownershipHistory: [
      { owner: 'Nordic Hunter', date: '2024-01-28', action: 'discovered' },
    ],
  },
  {
    id: '4',
    name: "Pirate's Lucky Coin",
    description:
      'A simple coin that brought luck to its pirate owner. Worn smooth by countless voyages.',
    rarity: 'common',
    imageUrl: 'https://picsum.photos/seed/marketplace4/400/300',
    discoveredBy: 'Sea Wanderer',
    hunt: 'Coastal Exploration',
    discoveryDate: '2024-03-01',
    currentOwner: 'Sea Wanderer',
    isForSale: false,
    ownershipHistory: [
      { owner: 'Sea Wanderer', date: '2024-03-01', action: 'discovered' },
    ],
  },
  {
    id: '5',
    name: 'Emerald Dragon Eye',
    description:
      "A massive emerald carved in the shape of a dragon's eye. Radiates mystical energy.",
    rarity: 'legendary',
    imageUrl: 'https://picsum.photos/seed/marketplace5/400/300',
    discoveredBy: 'Dragon Seeker',
    hunt: 'Mountain Cave Quest',
    discoveryDate: '2024-01-20',
    currentOwner: 'Museum Curator',
    ownershipHistory: [
      { owner: 'Dragon Seeker', date: '2024-01-20', action: 'discovered' },
      {
        owner: 'Private Collector',
        date: '2024-01-25',
        price: 400,
        action: 'purchased',
      },
      {
        owner: 'Museum Curator',
        date: '2024-02-01',
        price: 600,
        action: 'purchased',
      },
    ],
  },
  {
    id: '6',
    name: 'Crystal Healing Pendant',
    description:
      'A translucent crystal pendant that seems to pulse with healing energy.',
    rarity: 'epic',
    imageUrl: 'https://picsum.photos/seed/random6/500/400',
    discoveredBy: 'Crystal Hunter',
    hunt: 'Crystal Caves Adventure',
    discoveryDate: '2024-02-15',
    currentOwner: 'Crystal Hunter',
    price: 250,
    isForSale: true,
    ownershipHistory: [
      { owner: 'Crystal Hunter', date: '2024-02-15', action: 'discovered' },
    ],
  },
  {
    id: '7',
    name: 'Ancient Egyptian Scarab',
    description:
      'A golden scarab beetle amulet from ancient Egypt. Symbols of rebirth and protection.',
    rarity: 'rare',
    imageUrl: 'https://picsum.photos/seed/random7/500/400',
    discoveredBy: 'Pyramid Explorer',
    hunt: 'Sahara Expedition',
    discoveryDate: '2024-02-20',
    currentOwner: 'Pyramid Explorer',
    price: 180,
    isForSale: true,
    ownershipHistory: [
      { owner: 'Pyramid Explorer', date: '2024-02-20', action: 'discovered' },
    ],
  },
  {
    id: '8',
    name: 'Silver Moon Amulet',
    description:
      'A silver amulet that changes color with the phases of the moon.',
    rarity: 'rare',
    imageUrl: 'https://picsum.photos/seed/random8/500/400',
    discoveredBy: 'Moon Chaser',
    hunt: 'Lunar Temple Hunt',
    discoveryDate: '2024-03-05',
    currentOwner: 'Moon Chaser',
    isForSale: false,
    ownershipHistory: [
      { owner: 'Moon Chaser', date: '2024-03-05', action: 'discovered' },
    ],
  },
  {
    id: '9',
    name: 'Weathered Treasure Map',
    description:
      'An old map showing the location of several buried treasures. Some locations already discovered.',
    rarity: 'common',
    imageUrl: 'https://picsum.photos/seed/random9/500/400',
    discoveredBy: 'Map Collector',
    hunt: 'Library Investigation',
    discoveryDate: '2024-02-28',
    currentOwner: 'Adventure Guild',
    ownershipHistory: [
      { owner: 'Map Collector', date: '2024-02-28', action: 'discovered' },
      {
        owner: 'Adventure Guild',
        date: '2024-03-02',
        price: 50,
        action: 'purchased',
      },
    ],
  },
  {
    id: '10',
    name: 'Phoenix Feather Quill',
    description:
      'A rare quill made from a phoenix feather. Writing with it creates permanent, magical text.',
    rarity: 'legendary',
    imageUrl: 'https://picsum.photos/seed/random10/500/400',
    discoveredBy: 'Mythical Hunter',
    hunt: 'Phoenix Nest Expedition',
    discoveryDate: '2024-01-10',
    currentOwner: 'Mythical Hunter',
    price: 750,
    isForSale: true,
    ownershipHistory: [
      { owner: 'Mythical Hunter', date: '2024-01-10', action: 'discovered' },
    ],
  },
];

const rarityColors = {
  common: 'bg-gray-100 text-gray-800 border-gray-300',
  rare: 'bg-blue-100 text-blue-800 border-blue-300',
  epic: 'bg-purple-100 text-purple-800 border-purple-300',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

const rarityGradients = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600',
};

const ArtefactsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtefact, setSelectedArtefact] = useState<Artefact | null>(
    null
  );
  const itemsPerPage = 9;

  // Filter artefacts based on search and rarity
  const filteredArtefacts = MOCK_ARTEFACTS.filter((artefact) => {
    const matchesSearch =
      artefact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artefact.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity =
      rarityFilter === 'all' || artefact.rarity === rarityFilter;
    return matchesSearch && matchesRarity;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArtefacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtefacts = filteredArtefacts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section className="relative h-screen pt-20 bg-white overflow-hidden">
      <div className="relative z-10 h-full flex">
        {/* Left Sidebar - Filters */}
        <div className="w-80 border-r border-gray-200 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Filter Artefacts
          </h2>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <Input
              placeholder="Search artefacts..."
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
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              Showing {paginatedArtefacts.length} of {filteredArtefacts.length}{' '}
              artefacts
            </p>
          </div>
        </div>

        {/* Right Content - Cards and Pagination */}
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
                      {artefact.isForSale && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                          FOR SALE
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
                        <span className="text-gray-500">Discovered by:</span>
                        <span className="text-gray-900 font-medium">
                          {artefact.discoveredBy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current Owner:</span>
                        <span className="text-gray-900">
                          {artefact.currentOwner}
                        </span>
                      </div>
                      {artefact.isForSale && artefact.price && (
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-gray-500">Price:</span>
                          <span className="text-sm font-bold text-green-600">
                            👑 {artefact.price}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="flex-1 bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
                          onClick={() => setSelectedArtefact(artefact)}
                        >
                          History
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{artefact.name}</DialogTitle>
                          <DialogDescription>
                            Ownership History
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          {artefact.ownershipHistory.map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {entry.owner}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {entry.action.charAt(0).toUpperCase() +
                                    entry.action.slice(1)}{' '}
                                  on {formatDate(entry.date)}
                                </p>
                              </div>
                              {entry.price && (
                                <span className="text-green-600 font-bold">
                                  ${entry.price}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                    {artefact.isForSale && (
                      <Button className="flex-1 bg-black text-white hover:bg-gray-800 text-xs">
                        Buy
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 p-6">
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="text-sm"
                >
                  Previous
                </Button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 text-sm ${
                          currentPage === page
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'text-gray-700'
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="text-sm"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtefactsSection;
