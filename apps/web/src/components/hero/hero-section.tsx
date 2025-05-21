import { MapPin, Compass, Flag } from "lucide-react"
import ButtonLink from "./button-link"

const Hero = () => {
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-5xl">🏝️</span>
            <span className="text-5xl">🏴‍☠️</span>
            <span className="text-5xl">💎</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Discover Hidden Treasures
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mb-8">
            Join exciting treasure hunts in your city. Find clues, solve
            puzzles, and win real prizes.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ButtonLink
              href="#download"
              variant="default"
              className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-full"
            >
              Download Now
            </ButtonLink>
            <ButtonLink
              href="#learn-more"
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 px-8 py-6 text-lg rounded-full"
            >
              Learn More
            </ButtonLink>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-World Quests</h3>
              <p className="text-gray-600 text-center">
                Explore your city like never before with location-based treasure
                hunts.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Solve Mysteries</h3>
              <p className="text-gray-600 text-center">
                Decode cryptic clues and solve puzzles to find hidden treasures.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Flag className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Win Prizes</h3>
              <p className="text-gray-600 text-center">
                Compete with friends and win exciting real-world rewards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
