"use client"

import { useState } from "react"
import { AlertTriangle, MessageSquare, Globe, Shield, Info, Check, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const translations = {
  ja: {
    title: "SafeGuide Japan",
    subtitle: "緊急サポート",
    earthquake: "地震",
    magnitude: "M6.2",
    active: "発生中",
    location: "青森県",
    timeAgo: "2分前",
    alertInfo: "災害情報",
    askAI: "AIに質問",
    whatsHappening: "何が起きている？",
    happeningDesc:
      "青森県で14:23（日本時間）にマグニチュード6.2の地震が発生しました。余震が予想されます。落ち着いて安全指示に従ってください。",
    epicenter: "震源地：青森市の北東40km",
    depth: "深さ：10km（浅い）",
    tsunami: "津波リスク：監視中",
    actionItems: "行動チェックリスト",
    doNot: "やってはいけないこと",
    todos: [
      "窓や重い家具から離れる",
      "揺れが続く場合はテーブルの下に入る",
      "スマートフォンを充電しておく",
      "自治体の指示に従う",
    ],
    donts: [
      "エレベーターを使用しない",
      "損傷した建物に近づかない",
      "避難指示が出た場合は自宅に戻らない",
      "未確認の情報を拡散しない",
    ],
    aiAssistant: "AI緊急アシスタント",
    aiSubtitle: "あなたの言語で質問してください",
    aiWelcome: "こんにちは！質問にお答えします。例えば：",
    aiExamples: ["• 「外出しても安全ですか？」", "• 「最寄りの病院はどこですか？」", "• 「大使館に連絡するには？」"],
    quickQuestions: "よくある質問",
    suggestedQuestions: [
      "公共交通機関は使えますか？",
      "ホテルのエリアは安全ですか？",
      "余震があったらどうすればいい？",
      "大使館への連絡方法は？",
    ],
    placeholder: "質問を入力してください...",
    send: "送信",
    emergencyContacts: "緊急連絡先",
    contacts: [
      { name: "緊急サービス", number: "110 / 119", desc: "警察 / 消防・救急" },
      { name: "外国人旅行者向けホットライン", number: "050-3816-2787", desc: "24時間多言語対応" },
      { name: "医療相談", number: "#7119", desc: "救急相談窓口" },
    ],
  },
  en: {
    title: "SafeGuide Japan",
    subtitle: "Emergency Support",
    earthquake: "Earthquake",
    magnitude: "M6.2",
    active: "ACTIVE",
    location: "Aomori Prefecture",
    timeAgo: "2 minutes ago",
    alertInfo: "Alert Info",
    askAI: "Ask AI",
    whatsHappening: "What's Happening?",
    happeningDesc:
      "A magnitude 6.2 earthquake occurred in Aomori Prefecture at 14:23 JST. Aftershocks are expected. Stay calm and follow safety instructions.",
    epicenter: "Epicenter: 40km northeast of Aomori City",
    depth: "Depth: 10km (shallow)",
    tsunami: "Tsunami risk: Monitoring",
    actionItems: "Action Items",
    doNot: "Do Not",
    todos: [
      "Stay away from windows and heavy furniture",
      "Get under a table if shaking continues",
      "Keep your phone charged",
      "Follow local authorities instructions",
    ],
    donts: [
      "Do not use elevators",
      "Do not go near damaged buildings",
      "Do not return home if evacuation ordered",
      "Do not spread unverified information",
    ],
    aiAssistant: "AI Emergency Assistant",
    aiSubtitle: "Ask questions in your language",
    aiWelcome: "Hello! I can help answer your questions. Try asking:",
    aiExamples: [
      '• "Is it safe to go outside?"',
      '• "Where is the nearest hospital?"',
      '• "How do I contact my embassy?"',
    ],
    quickQuestions: "Quick Questions",
    suggestedQuestions: [
      "Can I use public transport?",
      "Is my hotel area safe?",
      "What if there's an aftershock?",
      "How to contact embassy?",
    ],
    placeholder: "Type your question...",
    send: "Send",
    emergencyContacts: "Emergency Contacts",
    contacts: [
      { name: "Emergency Services", number: "110 / 119", desc: "Police / Fire & Ambulance" },
      { name: "Tourist Hotline", number: "050-3816-2787", desc: "24/7 Multi-language" },
      { name: "Medical Advice", number: "#7119", desc: "Non-emergency consultation" },
    ],
  },
}

export default function DisasterApp() {
  const [language, setLanguage] = useState<"ja" | "en">("en")
  const [activeTab, setActiveTab] = useState<"alert" | "chat">("alert")
  const [checkedTodos, setCheckedTodos] = useState<Record<number, boolean>>({})

  const toggleTodo = (idx: number) => {
    setCheckedTodos((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const t = translations[language]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{t.title}</h1>
              <p className="text-xs text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "ja" : "en")}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "English" : "日本語"}
          </Button>
        </div>
      </header>

      <div className="border-b border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-foreground">
                  {t.earthquake} - {t.magnitude}
                </h2>
                <Badge variant="destructive" className="text-xs">
                  {t.active}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t.location} • {t.timeAgo}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("alert")}
              className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-semibold transition-colors ${
                activeTab === "alert"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              {t.alertInfo}
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-semibold transition-colors ${
                activeTab === "chat"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              {t.askAI}
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 pb-24">
        {activeTab === "alert" && (
          <div className="mx-auto max-w-3xl space-y-5">
            {/* What's Happening */}
            <Card className="overflow-hidden border-l-4 border-l-primary">
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  <h2 className="text-base font-bold text-foreground">{t.whatsHappening}</h2>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-foreground">{t.happeningDesc}</p>
                <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {t.epicenter}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {t.depth}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {t.tsunami}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-l-4 border-l-success">
                <div className="p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-success">
                    <Shield className="h-4 w-4" />
                    {t.actionItems}
                  </h3>
                  <ul className="space-y-2.5">
                    {t.todos.map((item, idx) => (
                      <li key={idx}>
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                          <input
                            type="checkbox"
                            checked={checkedTodos[idx] || false}
                            onChange={() => toggleTodo(idx)}
                            className="peer sr-only"
                          />
                          <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 border-input bg-background transition-all peer-checked:border-success peer-checked:bg-success">
                            <Check className="h-3.5 w-3.5 text-success-foreground opacity-0 peer-checked:opacity-100" />
                          </div>
                          <span
                            className={`text-sm leading-tight transition-all ${
                              checkedTodos[idx] ? "text-muted-foreground line-through" : "text-foreground"
                            }`}
                          >
                            {item}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              <Card className="border-l-4 border-l-destructive">
                <div className="p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    {t.doNot}
                  </h3>
                  <ul className="space-y-2.5">
                    {t.donts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 rounded-lg p-2">
                        <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border-2 border-destructive/20 bg-destructive/10" />
                        <span className="text-sm leading-tight text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="mx-auto max-w-3xl space-y-4">
            <Card>
              <div className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">{t.aiAssistant}</h2>
                    <p className="text-xs text-muted-foreground">{t.aiSubtitle}</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="mb-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 rounded-2xl rounded-tl-sm bg-muted p-3">
                      <p className="text-sm leading-relaxed text-foreground">{t.aiWelcome}</p>
                      <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                        {t.aiExamples.map((example, idx) => (
                          <li key={idx}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Suggested Questions */}
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">{t.quickQuestions}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {t.suggestedQuestions.map((question, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="h-auto justify-start py-2 text-left text-xs bg-transparent"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t.placeholder}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button size="sm" className="px-4">
                    {t.send}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">{t.emergencyContacts}</h3>
                </div>
                <div className="space-y-2">
                  {t.contacts.map((contact, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.desc}</p>
                      </div>
                      <Button variant="default" size="sm" className="ml-3 shrink-0 text-xs font-bold">
                        {contact.number}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
