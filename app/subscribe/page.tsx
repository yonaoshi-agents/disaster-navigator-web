"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { cn } from "@/lib/utils"

const PRICE_PER_DAY = 2

export default function SubscribePage() {
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1 // Include both start and end dates
  }

  const calculateTotal = () => {
    const days = calculateDays()
    return days * PRICE_PER_DAY
  }

  const handleSubscribe = () => {
    if (!startDate || !endDate) {
      return
    }

    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)
      router.push("/safe")
    }, 2000)
  }

  return (
    <>
      <Navigation />
      <div className="min-h-[calc(100vh-4rem)] bg-muted/30 p-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Subscribe to NowWay</h1>
            <p className="text-muted-foreground">
              Get covered before you travel. Access emergency support when disaster strikes.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Travel Dates
              </CardTitle>
              <CardDescription>Select your travel start and end dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => {
                          const today = new Date(new Date().setHours(0, 0, 0, 0))
                          if (date < today) return true
                          if (startDate && date < startDate) return true
                          return false
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {startDate && endDate && (
                <div className="rounded-lg bg-primary/5 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Selected Duration</p>
                  <p className="text-2xl font-bold text-primary">{calculateDays()} days</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Start Date:</span>
                <span className="font-medium">
                  {startDate ? format(startDate, "PP") : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">End Date:</span>
                <span className="font-medium">
                  {endDate ? format(endDate, "PP") : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{calculateDays()} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per day:</span>
                <span className="font-medium">${PRICE_PER_DAY}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">${calculateTotal()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubscribe}
                disabled={!startDate || !endDate || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Processing..." : "Subscribe & Get Protected"}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            <br />
            Your protection begins immediately after payment confirmation.
          </div>
        </div>
      </div>
    </>
  )
}
