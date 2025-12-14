"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Shield, Check, Calendar } from "lucide-react"
import { Navigation } from "@/components/navigation"

const plans = [
  {
    id: "basic",
    name: "Basic Protection",
    pricePerDay: 5,
    features: [
      "Real-time disaster alerts",
      "Multi-language support",
      "Emergency action guidance",
      "24/7 access during disasters",
    ],
  },
  {
    id: "premium",
    name: "Premium Protection",
    pricePerDay: 10,
    features: [
      "Everything in Basic",
      "AI-powered chatbot assistance",
      "Priority emergency notifications",
      "Offline access capability",
      "Travel insurance coordination",
    ],
    recommended: true,
  },
]

export default function SubscribePage() {
  const router = useRouter()
  const [days, setDays] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("premium")
  const [isLoading, setIsLoading] = useState(false)

  const calculateTotal = () => {
    const numDays = Number.parseInt(days) || 0
    const plan = plans.find((p) => p.id === selectedPlan)
    return numDays * (plan?.pricePerDay || 0)
  }

  const handleSubscribe = () => {
    if (!days || Number.parseInt(days) <= 0) {
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
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold">Choose Your Protection Plan</h1>
            <p className="text-muted-foreground">
              Get covered before you travel. Access emergency support when disaster strikes.
            </p>
          </div>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Travel Duration
                </CardTitle>
                <CardDescription>How many days will you be staying in Japan?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="days">Number of days</Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    max="365"
                    placeholder="Enter number of days"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Select a Plan</h2>
            <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <label key={plan.id} htmlFor={plan.id} className="cursor-pointer">
                  <Card
                    className={`relative transition-all ${
                      selectedPlan === plan.id ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"
                    }`}
                  >
                    {plan.recommended && <Badge className="absolute -top-2 right-4">Recommended</Badge>}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription className="mt-2">
                            <span className="text-2xl font-bold text-foreground">${plan.pricePerDay}</span>
                            <span className="text-muted-foreground"> / day</span>
                          </CardDescription>
                        </div>
                        <RadioGroupItem value={plan.id} id={plan.id} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </label>
              ))}
            </RadioGroup>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{plans.find((p) => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{days || 0} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per day:</span>
                <span className="font-medium">${plans.find((p) => p.id === selectedPlan)?.pricePerDay}</span>
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
                disabled={!days || Number.parseInt(days) <= 0 || isLoading}
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
