"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Home, User, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/subscribe", label: "Subscribe", icon: CreditCard },
    { href: "/signin", label: "Sign In", icon: User },
  ]

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <Shield className="h-6 w-6" />
          <span className="hidden sm:inline">NowWay</span>
        </Link>

        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button key={item.href} asChild variant={isActive ? "default" : "ghost"} size="sm">
                <Link href={item.href} className="gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
