import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
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
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Users,
  Crown,
  MapPin,
  Globe,
  Lock,
  Unlock,
} from 'lucide-react';
import type { Hunt } from '@/lib/types';

// Extended Hunt type with image for mock data
type HuntWithImage = Hunt & {
  imageUrl?: string;
};

// Mock hunt data
const MOCK_HUNTS: HuntWithImage[] = [
  {
    id: '1',
    title: 'Caribbean Treasure Hunt',
    description:
      'Explore the mysterious islands of the Caribbean in search of ancient pirate treasures. Follow clues left by legendary captains.',
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
    description:
      'Venture into ancient temples filled with puzzles, traps, and hidden artifacts. Only the bravest will succeed.',
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
    description:
      'Navigate the treacherous fjords of Norway in search of Viking artifacts and ancient runes.',
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
    description:
      'Investigate urban legends and modern mysteries hidden in plain sight across major cities.',
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
    description:
      'Face mythical creatures and solve ancient riddles in this fantasy-themed adventure through enchanted lands.',
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
    description:
      'Explore underground crystal formations and discover rare gems while solving geological puzzles.',
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
    description:
      'Journey across the vast Sahara desert to uncover ancient Egyptian artifacts buried beneath the sands.',
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
    description:
      'A mystical hunt that follows the phases of the moon, revealing secrets only visible under moonlight.',
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

// Mock joined hunts data
const MOCK_JOINED_HUNTS: HuntWithImage[] = [
  MOCK_HUNTS[0], // Caribbean Treasure Hunt
  MOCK_HUNTS[2], // Fjord Expedition
  MOCK_HUNTS[5], // Crystal Caves Adventure
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-800 border-gray-300',
  active: 'bg-green-100 text-green-800 border-green-300',
  closed: 'bg-red-100 text-red-800 border-red-300',
};

const HuntsSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [worldTypeFilter, setWorldTypeFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'available' | 'joined'>('available');
  const itemsPerPage = 9;

  const currentHunts =
    viewMode === 'available' ? MOCK_HUNTS : MOCK_JOINED_HUNTS;

  // Filter hunts based on search and filters
  const filteredHunts = currentHunts.filter((hunt) => {
    const matchesSearch =
      hunt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hunt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hunt.organizerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || hunt.status === statusFilter;
    const matchesWorldType =
      worldTypeFilter === 'all' || hunt.worldType === worldTypeFilter;
    const matchesMode = modeFilter === 'all' || hunt.mode === modeFilter;
    return matchesSearch && matchesStatus && matchesWorldType && matchesMode;
  });

  // Sort hunts
  const sortedHunts = [...filteredHunts].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortBy) {
      case 'startDate':
        aValue = new Date(a.startDate);
        bValue = new Date(b.startDate);
        break;
      case 'participants':
        aValue = a.nbParticipants;
        bValue = b.nbParticipants;
        break;
      case 'feeCrowns':
        aValue = a.feeCrowns;
        bValue = b.feeCrowns;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedHunts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHunts = sortedHunts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getHuntState = (hunt: Hunt) => {
    const now = new Date();
    const startDate = new Date(hunt.startDate);
    const endDate = hunt.endDate ? new Date(hunt.endDate) : null;

    if (startDate > now) return 'upcoming';
    if (endDate && endDate < now) return 'ended';
    return 'active';
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'ended':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <section className="relative h-screen bg-white overflow-hidden">
      <div className="relative z-10 h-full flex max-w-7xl mx-auto">
        {/* Left Sidebar - Filters */}
        <div className="w-80 border-r border-gray-200 p-6 flex flex-col">
          <div className="flex gap-2 mb-6">
            <Button
              variant={viewMode === 'available' ? 'default' : 'outline'}
              onClick={() => {
                setViewMode('available');
                setCurrentPage(1);
              }}
              className="flex-1 text-sm rounded-xl"
            >
              Available Hunts
            </Button>
            <Button
              variant={viewMode === 'joined' ? 'default' : 'outline'}
              onClick={() => {
                setViewMode('joined');
                setCurrentPage(1);
              }}
              className="flex-1 text-sm rounded-xl"
            >
              Joined Hunts
            </Button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6">Filter Hunts</h2>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <Input
              placeholder="Search hunts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 rounded-xl"
            />
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* World Type Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              World Type
            </label>
            <Select value={worldTypeFilter} onValueChange={setWorldTypeFilter}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Filter by world type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="real">Real World</SelectItem>
                <SelectItem value="map">Virtual Map</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mode Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Mode
            </label>
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Filter by access mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startDate">Start Date</SelectItem>
                <SelectItem value="participants">Participants</SelectItem>
                <SelectItem value="feeCrowns">Fee</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <Select
              value={sortOrder}
              onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
            >
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              Showing {paginatedHunts.length} of {sortedHunts.length} hunts
            </p>
          </div>
        </div>

        {/* Right Content - Cards and Pagination */}
        <div className="flex-1 flex flex-col">
          {/* Scrollable Cards Grid */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-3 gap-8">
              {paginatedHunts.map((hunt) => {
                const huntState = getHuntState(hunt);
                const isFull =
                  hunt.nbParticipants >= (hunt.maxParticipants || 3000);
                const isPrivate = hunt.mode === 'private';

                return (
                  <Card
                    key={hunt.id}
                    className="cursor-pointer transition-all duration-300 bg-white border border-gray-200 hover:border-gray-300 hover:scale-105 hover:shadow-2xl shadow-lg group rounded-xl overflow-hidden"
                    onClick={() => {
                      if (hunt.id) {
                        navigate({ to: `/hunt/${hunt.id}` });
                      }
                    }}
                  >
                    <CardHeader className="relative pb-3">
                      {hunt.imageUrl && (
                        <div className="mb-3 -mx-6 -mt-6">
                          <img
                            src={hunt.imageUrl}
                            alt={hunt.title}
                            className="w-full h-56 object-cover rounded-t-lg"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className={`px-2 py-1 rounded-full text-xs font-bold border ${statusColors[hunt.status]}`}
                        >
                          {hunt.status.toUpperCase()}
                        </Badge>
                        <Badge
                          className={`px-2 py-1 rounded-full text-xs font-bold border ${getStateColor(huntState)}`}
                        >
                          {huntState.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-base text-gray-900 group-hover:text-black transition-colors">
                        {hunt.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-xs line-clamp-2">
                        {hunt.description}
                      </CardDescription>
                      {hunt.organizerName && (
                        <div className="text-xs text-gray-500 mt-1">
                          by {hunt.organizerName}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="text-gray-500">Start:</span>
                          </div>
                          <span className="text-gray-900 font-medium">
                            {formatDate(hunt.startDate)}
                          </span>
                        </div>
                        {hunt.endDate && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                              <span className="text-gray-500">End:</span>
                            </div>
                            <span className="text-gray-900">
                              {formatDate(hunt.endDate)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="text-gray-500">Participants:</span>
                          </div>
                          <span className="text-gray-900">
                            {hunt.nbParticipants}/{hunt.maxParticipants || '∞'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {hunt.worldType === 'real' ? (
                              <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                            ) : (
                              <Globe className="h-3 w-3 mr-1 text-gray-500" />
                            )}
                            <span className="text-gray-500">Type:</span>
                          </div>
                          <span className="text-gray-900">
                            {hunt.worldType === 'real'
                              ? 'Real World'
                              : 'Virtual'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {isPrivate ? (
                              <Lock className="h-3 w-3 mr-1 text-gray-500" />
                            ) : (
                              <Unlock className="h-3 w-3 mr-1 text-gray-500" />
                            )}
                            <span className="text-gray-500">Access:</span>
                          </div>
                          <span className="text-gray-900">
                            {isPrivate ? 'Private' : 'Public'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <div className="flex items-center">
                            <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                            <span className="text-gray-500">Fee:</span>
                          </div>
                          <span className="text-sm font-bold text-yellow-600">
                            👑 {hunt.feeCrowns}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex gap-2">
                      <Button 
                        className="flex-1 bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hunt.id) {
                            navigate({ to: `/hunt/${hunt.id}` });
                          }
                        }}
                      >
                        View Details
                      </Button>
                      {viewMode === 'available' && (
                        <Button
                          className="flex-1 bg-black text-white hover:bg-gray-800 text-xs rounded-xl"
                          disabled={
                            isFull || (isPrivate && hunt.status !== 'active')
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            if (hunt.id) {
                              navigate({ to: `/hunt/${hunt.id}` });
                            }
                          }}
                        >
                          {isFull
                            ? 'Full'
                            : isPrivate
                              ? 'Request Access'
                              : 'Join Hunt'}
                        </Button>
                      )}
                      {viewMode === 'joined' && (
                        <Button 
                          className="flex-1 bg-red-50 border border-red-300 text-red-700 hover:bg-red-100 text-xs rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle leave hunt functionality
                          }}
                        >
                          Leave Hunt
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
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
                  className="text-sm rounded-xl"
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
                        className={`w-10 h-10 text-sm rounded-xl ${
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
                  className="text-sm rounded-xl"
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

export default HuntsSection;
