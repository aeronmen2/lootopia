import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { huntImages } from '@/assets/images';
import BackgroundMap from '@/components/map/background-map';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const cardsPerSlide = 4;

  const huntCards = [
    {
      id: 1,
      title: 'Eiffel Tower',
      difficulty: 'Easy',
      reward: '100 coins',
      image: huntImages[1],
    },
    {
      id: 2,
      title: 'Colosseum',
      difficulty: 'Medium',
      reward: '250 coins',
      image: huntImages[2],
    },
    {
      id: 3,
      title: 'Machu Picchu',
      difficulty: 'Hard',
      reward: '500 coins',
      image: huntImages[3],
    },
    {
      id: 4,
      title: 'Great Wall',
      difficulty: 'Expert',
      reward: '1000 coins',
      image: huntImages[4],
    },
    {
      id: 5,
      title: 'Taj Mahal',
      difficulty: 'Easy',
      reward: '150 coins',
      image: huntImages[5],
    },
    {
      id: 6,
      title: 'Statue of Liberty',
      difficulty: 'Medium',
      reward: '300 coins',
      image: huntImages[6],
    },
    {
      id: 7,
      title: 'Big Ben',
      difficulty: 'Hard',
      reward: '600 coins',
      image: huntImages[7],
    },
    {
      id: 8,
      title: 'Petra',
      difficulty: 'Expert',
      reward: '1200 coins',
      image: huntImages[8],
    },
    {
      id: 9,
      title: 'Christ Redeemer',
      difficulty: 'Legendary',
      reward: '2500 coins',
      image: huntImages[9],
    },
    {
      id: 10,
      title: 'Pyramids of Giza',
      difficulty: 'Mythic',
      reward: '5000 coins',
      image: huntImages[10],
    },
  ];

  const totalSlides = Math.ceil(huntCards.length / cardsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="h-screen w-full overflow-hidden">
      <div className="w-full h-full">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl m-6 p-8 md:p-12 lg:p-16 text-white h-[calc(100vh-3rem)] flex flex-col justify-between overflow-hidden relative">
          {/* Animated Map Background - Full Hero Container Coverage */}
          <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden opacity-30">
            <BackgroundMap className="w-full h-full" />
          </div>

          {/* Top Section with CTA */}

          {/* Center Section - Welcome Text */}
          <div className="text-center flex-1 flex flex-col justify-center relative z-10">
            {/* Content Overlay */}
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <span className="text-4xl animate-bounce">🏝️</span>
                <span className="text-4xl animate-bounce">🏴‍☠️</span>
                <span className="text-4xl animate-bounce">💎</span>
              </div>
              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 mb-4 px-8 py-3 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  🌟 Start Your Adventure
                </Button>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
                Welcome to Lootopia
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto drop-shadow-lg">
                Embark on thrilling treasure hunts and discover hidden treasures
                around the world
              </p>
            </div>
          </div>

          {/* Bottom Section with Hunt Cards Carousel */}
          <div className="space-y-8 relative z-10">
            {/* Hunt Cards Carousel */}
            <div className="relative">
              {/* Navigation Arrows */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/40 rounded-full"
                  disabled={totalSlides <= 1}
                >
                  ←
                </Button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/40 rounded-full"
                  disabled={totalSlides <= 1}
                >
                  →
                </Button>
              </div>

              {/* Cards Container */}
              <div className="overflow-hidden mx-12">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {huntCards
                          .slice(
                            slideIndex * cardsPerSlide,
                            (slideIndex + 1) * cardsPerSlide
                          )
                          .map((hunt) => (
                            <div
                              key={hunt.id}
                              className="group relative bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer overflow-hidden h-48"
                            >
                              {/* Background Image */}
                              <div
                                className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700 bg-cover bg-center"
                                style={{
                                  backgroundImage: hunt.image
                                    ? `url(${hunt.image})`
                                    : undefined,
                                }}
                              >
                                {/* Fallback icon if no image */}
                                {!hunt.image && (
                                  <div className="flex items-center justify-center h-full">
                                    <div className="text-6xl opacity-30">
                                      🗺️
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Overlay Content */}
                              <div className="relative z-10 h-full flex flex-col justify-center items-center p-6 bg-black/40 group-hover:bg-black/60 transition-all duration-300">
                                <div className="text-center">
                                  <h3 className="text-2xl font-light italic text-white drop-shadow-lg mb-4">
                                    {hunt.title}
                                  </h3>
                                  <div className="flex items-center justify-center space-x-1 mb-4">
                                    <span className="text-yellow-400 text-sm">
                                      🟡
                                    </span>
                                    <span className="text-white/90 text-sm font-medium drop-shadow">
                                      {hunt.reward.replace(' coins', '')}
                                    </span>
                                  </div>

                                  {/* See More Button - appears on hover */}
                                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <Button
                                      size="sm"
                                      className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40 rounded-full px-4 py-2 text-xs font-medium"
                                    >
                                      See More ✨
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide Indicators */}
              {totalSlides > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSlide
                          ? 'bg-white scale-125'
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
