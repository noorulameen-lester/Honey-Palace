import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function BrandStory() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="https://img.freepik.com/free-photo/beekeeper-working-bee-farm_23-2151441182.jpg?t=st=1751976191~exp=1751979791~hmac=2d16eb5ac779da477449fa777f165a2d3c2ceee481ebba4919631cd64ac7bb29&w=1380"
              alt="Beekeeper at work"
              width={600}
              height={500}
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold">25+</div>
              <div className="text-sm">Years of Experience</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Story: From Hive to Home</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Founded in 1998, Honey Palace began as a small family business with a simple mission: to bring the
                  purest, most delicious honey from local beekeepers directly to your table.
                </p>
                <p>
                  We work exclusively with certified organic beekeepers who share our commitment to sustainable
                  practices and bee welfare. Every jar of honey is carefully tested and meets our strict quality
                  standards.
                </p>
                <p>
                  Today, we're proud to support over 50 local beekeeping families while providing our customers with the
                  finest honey varieties from around the world.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Partner Beekeepers</div>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                  Learn More About Us
                </Button>
              </Link>
              <Link href="/certifications">
                <Button variant="outline" size="lg" className="border-amber-600 text-amber-600 bg-transparent">
                  View Certifications
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
