"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AlertTriangle, X, Check, Globe, MapPin, Clock, ChevronsLeft, ChevronsRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { api, type ChatMessage } from "@/lib/api"

const translations = {
  ja: {
    earthquake: "地震",
    shindo: "最大震度",
    time: "2分前",
    nextAction: "次のアクション",
    allDone: "すべての行動完了！",
    allDoneDesc: "安全を確保しました。自治体の指示に従ってください。",
    locating: "位置情報を取得中...",
    loading: "読み込み中...",
    noData: "データがありません",
    chatPlaceholder: "質問を入力してください...",
    aiAssistant: "AI アシスタント",
  },
  en: {
    earthquake: "EARTHQUAKE",
    shindo: "Max Seismic Intensity",
    time: "2 min ago",
    nextAction: "Next Action",
    allDone: "All Actions Complete!",
    allDoneDesc: "You're safe. Follow local authority instructions.",
    locating: "Locating...",
    loading: "Loading...",
    noData: "No data available",
    chatPlaceholder: "Type your question...",
    aiAssistant: "AI Assistant",
  },
}

export default function DisasterAppV2() {
  const [language, setLanguage] = useState<"ja" | "en">("en")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [locationName, setLocationName] = useState<string | null>(null)
  const [seismicIntensity, setSeismicIntensity] = useState<string | null>(null)
  const [apiActions, setApiActions] = useState<string[] | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)

  const t = translations[language]
  const currentActions = apiActions || []
  const currentAction = currentActions[currentIndex]
  const isComplete = currentIndex >= currentActions.length

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API calls commented out - using fixed data
        const eqData = await api.getEarthquake()
        setSeismicIntensity(eqData.seismic_intensity)

        const email = localStorage.getItem('user_email') || 'yamada@example.com'
        const actionsData = await api.getNextActions(email, eqData.seismic_intensity)
        if (actionsData.cards && actionsData.cards.length > 0) {
            setApiActions(actionsData.cards.map(c => c.message))
        }
      } catch (e) {
        console.error("Failed to fetch API data:", e)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          // Reverse Geocoding using OpenStreetMap Nominatim API (Free, requires attribution)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=${language}`
            )
            const data = await response.json()
            if (data && data.address) {
                // Prioritize prefecture (state), then city, then town/village
                const name = data.address.state || data.address.province || data.address.city || data.address.town || data.address.village || "Unknown Location"
                setLocationName(name)
            }
          } catch (error) {
            console.error("Error fetching address:", error)
            // Fallback to coordinates if geocoding fails, but handled in render
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [language]) // Re-run when language changes to get address in correct language

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = { role: "user", content: inputMessage }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputMessage("")

    try {
      const response = await api.sendChatMessage(updatedMessages)
      const aiMessage: ChatMessage = {
        role: "assistant",
        content: response.reply,
      }
      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)

      // Fetch query suggestions after AI response
      try {
        const suggestResponse = await api.getQuerySuggestions(finalMessages)
        setSuggestions(suggestResponse.suggest)
      } catch (suggestError) {
        console.error("Failed to fetch suggestions:", suggestError)
        setSuggestions([])
      }
    } catch (error) {
      console.error("Failed to send chat message:", error)
      // Fallback response on error
      const aiMessage: ChatMessage = {
        role: "assistant",
        content: language === "ja"
          ? "申し訳ございません。エラーが発生しました。もう一度お試しください。"
          : "Sorry, an error occurred. Please try again.",
      }
      setMessages((prev) => [...prev, aiMessage])
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

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
            {seismicIntensity ? (
              <div className="mb-4 text-7xl font-black md:text-9xl">{seismicIntensity}</div>
            ) : (
               <div className="mb-4 text-4xl font-bold animate-pulse">{t.loading}</div>
            )}
            <div className="text-xl font-semibold opacity-90 md:text-2xl">{t.shindo}</div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm opacity-90 md:gap-6 md:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {locationName || t.locating}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t.time}
            </div>
          </div>
        </div>

        {/* Bottom Half - Action Card */}
        <div className="relative flex flex-1 items-center justify-center bg-background p-6">
          {currentActions.length === 0 ? (
             <div className="text-center text-muted-foreground">
               {seismicIntensity ? t.noData : t.loading}
             </div>
          ) : (
          <>
          <div className="absolute inset-x-0 top-0 flex justify-center gap-1 pt-6">
            {currentActions.map((_, idx) => (
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
                  {currentIndex + 1} / {currentActions.length}
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
                      <div className="flex items-center gap-1 animate-pulse">
                        <ChevronsLeft className="h-6 w-6" />
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                          <X className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-2 text-success">
                      <div className="flex items-center gap-1 animate-pulse">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                          <Check className="h-5 w-5" />
                        </div>
                        <ChevronsRight className="h-6 w-6" />
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
            <div className="flex h-full w-full max-w-2xl flex-col">
              {/* Chat Header */}
              <div className="mb-4 text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                    <Check className="h-5 w-5 text-success" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{t.aiAssistant}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{t.allDoneDesc}</p>
              </div>

              {/* Chat Messages */}
              <div className="mb-4 h-[400px] overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-6 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {language === "ja"
                        ? "何か質問があればお気軽にお尋ねください"
                        : "Feel free to ask any questions"}
                    </p>
                    <div className="flex w-full max-w-sm flex-col gap-2">
                      {[
                        "Where is the nearest shelter?",
                        "What should I do immediately?",
                        "How do I prepare an emergency kit?",
                      ].map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInputMessage(question)}
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-card text-card-foreground border border-border"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Query Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={t.chatPlaceholder}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </>
  )
}
