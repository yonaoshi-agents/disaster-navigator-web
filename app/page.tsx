"use client"

import type React from "react"

import { useState, useRef } from "react"
import { AlertTriangle, X, Check, Globe, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"

const translations = {
  ja: {
    earthquake: "地震",
    magnitude: "マグニチュード",
    location: "青森県",
    time: "2分前",
    depth: "深さ 10km",
    nextAction: "次のアクション",
    swipeRight: "完了したら右にスワイプ",
    swipeLeft: "できない場合は左にスワイプ",
    allDone: "すべての行動完了！",
    allDoneDesc: "安全を確保しました。自治体の指示に従ってください。",
    actions: [
      "窓や重い家具から離れる",
      "揺れが続く場合はテーブルの下に入る",
      "スマートフォンを充電する",
      "避難経路を確認する",
      "緊急持ち出し袋を準備する",
      "自治体の指示を待つ",
    ],
  },
  en: {
    earthquake: "EARTHQUAKE",
    magnitude: "Magnitude",
    location: "Aomori Prefecture",
    time: "2 min ago",
    depth: "Depth 10km",
    nextAction: "Next Action",
    swipeRight: "Swipe right when done",
    swipeLeft: "Swipe left if not possible",
    allDone: "All Actions Complete!",
    allDoneDesc: "You're safe. Follow local authority instructions.",
    actions: [
      "Move away from windows and heavy furniture",
      "Get under a table if shaking continues",
      "Charge your smartphone",
      "Check evacuation routes",
      "Prepare emergency supplies",
      "Wait for local authority instructions",
    ],
  },
}

export default function DisasterAppV2() {
  const [language, setLanguage] = useState<"ja" | "en">("en")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)

  const t = translations[language]
  const currentAction = t.actions[currentIndex]
  const isComplete = currentIndex >= t.actions.length

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentX = e.touches[0].clientX
    const diff = currentX - startX.current
    setDragX(diff)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (Math.abs(dragX) > 100) {
      setCurrentIndex((prev) => prev + 1)
      setDragX(0)
    } else {
      setDragX(0)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const diff = e.clientX - startX.current
    setDragX(diff)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (Math.abs(dragX) > 100) {
      setCurrentIndex((prev) => prev + 1)
      setDragX(0)
    } else {
      setDragX(0)
    }
  }

  const opacity = 1 - Math.abs(dragX) / 300
  const rotation = dragX / 20

  return (
    <>
      <Navigation />
      <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
        {/* Top Half - Critical Information */}
        <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-primary via-primary to-destructive p-8 text-primary-foreground">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "ja" : "en")}
            className="absolute right-4 top-20 gap-2 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "EN" : "日"}
          </Button>

          <div className="mb-6 flex items-center gap-3">
            <AlertTriangle className="h-12 w-12 animate-pulse" />
          </div>

          <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-6xl">{t.earthquake}</h1>

          <div className="mb-8 text-center">
            <div className="mb-4 text-7xl font-black md:text-9xl">6.2</div>
            <div className="text-xl font-semibold opacity-90 md:text-2xl">{t.magnitude}</div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm opacity-90 md:gap-6 md:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t.location}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t.time}
            </div>
            <div className="rounded-full bg-primary-foreground/20 px-3 py-1 text-sm font-semibold">{t.depth}</div>
          </div>
        </div>

        {/* Bottom Half - Action Card */}
        <div className="relative flex flex-1 items-center justify-center bg-background p-6">
          <div className="absolute inset-x-0 top-0 flex justify-center gap-1 pt-6">
            {t.actions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-8 rounded-full transition-all ${
                  idx < currentIndex ? "bg-success" : idx === currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {!isComplete ? (
            <div className="w-full max-w-md">
              <div className="mb-4 text-center">
                <div className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {t.nextAction}
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {t.actions.length}
                </div>
              </div>

              <div
                ref={cardRef}
                className="relative touch-none select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => {
                  if (isDragging) {
                    handleMouseUp()
                  }
                }}
                style={{
                  transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
                  opacity: opacity,
                  transition: isDragging ? "none" : "transform 0.3s ease, opacity 0.3s ease",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
              >
                <div className="rounded-2xl border-4 border-border bg-card p-8 shadow-2xl">
                  <div className="mb-8 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <AlertTriangle className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  <p className="mb-8 text-center text-2xl font-bold leading-tight text-card-foreground md:text-3xl">
                    {currentAction}
                  </p>

                  <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
                    <div className="flex flex-1 items-center gap-2 text-destructive">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <X className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-semibold">{t.swipeLeft}</div>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-2 text-success">
                      <div className="text-right text-sm font-semibold">{t.swipeRight}</div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                        <Check className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {dragX > 50 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-success p-4 shadow-xl">
                    <Check className="h-8 w-8 text-success-foreground" />
                  </div>
                )}
                {dragX < -50 && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-destructive p-4 shadow-xl">
                    <X className="h-8 w-8 text-destructive-foreground" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-10 w-10 text-success" />
                </div>
              </div>
              <h2 className="mb-3 text-3xl font-bold text-foreground">{t.allDone}</h2>
              <p className="text-lg text-muted-foreground">{t.allDoneDesc}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
