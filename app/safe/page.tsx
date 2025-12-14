"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sun, Palmtree, MapPin, Shield } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function SafePage() {
  const router = useRouter()
  const [userLocation, setUserLocation] = useState<string | null>(null)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=ja`
            )
            const data = await response.json()
            if (data && data.address) {
              const name = data.address.state || data.address.province || data.address.city || data.address.town || data.address.village || "Unknown Location"
              setUserLocation(name)
            }
          } catch (error) {
            console.error("Error fetching address:", error)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  return (
    <>
      <Navigation />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-blue-50 to-green-50 p-4 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Sun className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <Badge className="mb-4 bg-green-600 text-white hover:bg-green-700">
            <Shield className="mr-1 h-3 w-3" />
            Subscribed
          </Badge>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            No Disasters Currently Active
          </h1>

          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            Enjoy Your Trip to Japan!
          </p>

          <Card className="mb-8 border-green-200 bg-white/80 backdrop-blur dark:border-green-800 dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                <MapPin className="h-5 w-5" />
                Current Seismic Intensity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-6xl font-bold text-green-600 dark:text-green-400">0</div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {userLocation ? `Location: ${userLocation}` : "Locating..."}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  SafeGuide Japan is monitoring 24/7. We'll notify you immediately if a disaster occurs.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8 flex items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
            <Palmtree className="h-8 w-8" />
            <Palmtree className="h-6 w-6" />
            <Palmtree className="h-8 w-8" />
          </div>

          <div className="space-y-4">
            <Card className="bg-white/60 backdrop-blur dark:bg-gray-800/60">
              <CardContent className="pt-6">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">✨ Recommended Spots</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You can safely enjoy sightseeing. Visit famous landmarks like Mt. Fuji, Kyoto, and Tokyo Tower.
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            We'll provide real-time evacuation information in case of emergency
          </p>
        </div>
      </div>
    </>
  )
}
