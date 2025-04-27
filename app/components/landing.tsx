"use client"
import Link from "next/link"
import { Music, Users, Share2, Youtube, Music2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Appbar } from "./Appbar"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"

export default function LandingPage() {
  const session=useSession();
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <Appbar/>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 to-fuchsia-900/20 z-0"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10 z-0"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Let the Crowd Pick the Beat
            </h1>
            <p className="text-xl text-gray-300">
              Create collaborative music streams where your audience votes on what plays next.
            </p>
            <Button className="px-8 py-6 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-xl shadow-lg shadow-violet-700/20">
              Start a Stream
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Sangeet
            </span>
            </h2>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden">
            {/* Feature 1 */}
            <div className="rounded-xl p-6 backdrop-blur-md bg-gray-800/30 border border-gray-700 hover:border-violet-500/50 transition-all shadow-lg">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Music Voting</h3>
                <p className="text-gray-400">
                Let your audience democratically choose what plays next with live voting.
                </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl p-6 backdrop-blur-md bg-gray-800/30 border border-gray-700 hover:border-violet-500/50 transition-all shadow-lg">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Shareable Stream Links</h3>
                <p className="text-gray-400">
                Generate unique links for your streams and share them anywhere.
                </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl p-6 backdrop-blur-md bg-gray-800/30 border border-gray-700 hover:border-violet-500/50 transition-all shadow-lg">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4">
                <Youtube className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">YouTube Integration</h3>
                <p className="text-gray-400">
                Seamlessly play music from YouTube with thumbnails and titles.
                </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl p-6 backdrop-blur-md bg-gray-800/30 border border-gray-700 hover:border-violet-500/50 transition-all shadow-lg">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Audience Engagement</h3>
                <p className="text-gray-400">
                Keep your audience engaged with interactive music selection.
                </p>
            </div>
            </div>
        </div>
    </section>


      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6 p-8 rounded-2xl bg-gradient-to-r from-violet-900/20 to-fuchsia-900/20 backdrop-blur-sm border border-gray-800">
            <h2 className="text-3xl font-bold">Ready to Create Your Music Stream?</h2>
            <p className="text-gray-300">
              Start your collaborative music journey today and let your audience influence the playlist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-6 py-6">
                Start a Stream
              </Button>
              <Button variant="outline" className="border-violet-500 text-white hover:bg-violet-950/50 px-6 py-6">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-r from-violet-500 to-fuchsia-500">
                <Music2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Sangeet
              </span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <div className="mt-4 md:mt-0 text-gray-500 text-sm">
              © {new Date().getFullYear()} Sangeet. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
