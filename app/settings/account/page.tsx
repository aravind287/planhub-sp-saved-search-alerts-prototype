"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, ChevronRight, Info, Sparkles } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlanHubHeader } from "@/components/planhub-header"
import { useSettings } from "@/lib/settings-context"

// Sidebar navigation items
const sidebarItems = [
  { label: "Account", href: "/settings/account", active: false },
  { label: "Notifications", href: "/settings/account", active: true },
  { label: "Company Settings", href: "/settings/company", active: false },
]

export default function NotificationsSettingsPage() {
  // Use shared settings context
  const { notificationSettings, updateNotificationSettings, savedSearches, hasActiveAlert } = useSettings()
  
  // Local state for new keyword input
  const [newKeyword, setNewKeyword] = useState("")

  // Destructure notification settings for easier access
  const {
    newMessages,
    itbsOutsideNetwork,
    estimateRequests,
    savedSearchAlertsEnabled,
    itbEnabled,
    itbFrequency,
    projectStatusUpdates,
    bidDueDateReminders,
    keywordAlertsEnabled,
    legacyKeywords: keywords,
  } = notificationSettings

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      updateNotificationSettings({ legacyKeywords: [...keywords, newKeyword.trim()] })
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    updateNotificationSettings({ legacyKeywords: keywords.filter(k => k !== keyword) })
  }

  return (
    <div className="min-h-screen bg-background">
      <PlanHubHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 border-r border-border min-h-[calc(100vh-56px)] bg-card">
          <div className="p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              MENU
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                    item.active
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Notifications</h1>
            <p className="text-muted-foreground mb-8">
              Determine the type of emails you receive from PlanHub.
            </p>

            {/* General Communication Section */}
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border">
                General communication
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">When new messages arrive in PlanHub</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={newMessages} onCheckedChange={(checked) => updateNotificationSettings({ newMessages: checked })} />
                    <span className="text-xs text-muted-foreground w-6">{newMessages ? "On" : "Off"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">ITBs from general contractors outside my network</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={itbsOutsideNetwork} onCheckedChange={(checked) => updateNotificationSettings({ itbsOutsideNetwork: checked })} />
                    <span className="text-xs text-muted-foreground w-6">{itbsOutsideNetwork ? "On" : "Off"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground">I want to receive estimate requests</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={estimateRequests} onCheckedChange={(checked) => updateNotificationSettings({ estimateRequests: checked })} />
                    <span className="text-xs text-muted-foreground w-6">{estimateRequests ? "On" : "Off"}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Project Notifications Section */}
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-border">
                Project related communication
              </h2>

              {/* NEW: Saved Search Alerts */}
              <div className="mb-6 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">Enable Saved Search Alerts</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          NEW
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Receive notifications when new projects match your saved search filters and keywords.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={savedSearchAlertsEnabled} onCheckedChange={(checked) => updateNotificationSettings({ savedSearchAlertsEnabled: checked })} />
                    <span className="text-xs text-muted-foreground w-6">{savedSearchAlertsEnabled ? "On" : "Off"}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 rounded px-3 py-2">
                  <Info className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Saved Search Alerts are the most precise way to receive project notifications.</span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Manage your saved searches on the Projects page
                  </span>
                  <Link 
                    href="/"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Go to Saved Searches <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Invitations to Bid */}
              <div className="mb-6">
                <div className="flex items-center justify-between py-2 mb-3">
                  <span className="text-sm text-foreground">Invitations to bid</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={itbEnabled} onCheckedChange={(checked) => updateNotificationSettings({ itbEnabled: checked })} />
                    <span className="text-xs text-muted-foreground w-6">{itbEnabled ? "On" : "Off"}</span>
                  </div>
                </div>

                {itbEnabled && (
                  <div className="pl-4 border-l-2 border-border space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Frequency</Label>
                      <RadioGroup 
                        value={itbFrequency} 
                        onValueChange={(v) => updateNotificationSettings({ itbFrequency: v as "daily" | "instant" })}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="daily" id="daily" />
                          <Label htmlFor="daily" className="text-sm font-normal cursor-pointer">
                            Daily summary
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="instant" id="instant" />
                          <Label htmlFor="instant" className="text-sm font-normal cursor-pointer">
                            Every time new project is posted
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      If you do not want to receive all invitations to bid that your company is receiving, unselect any regions that you are not interested in.
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                      <Select>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Primary trades (80)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All trades</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Construction Type (2)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All types</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="States & Regions (1)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All regions</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Building Use (40)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All uses</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Counties (11)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All counties</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Project status updates */}
              <div className="flex items-center justify-between py-2 mb-3">
                <span className="text-sm text-foreground">Project status updates</span>
                <div className="flex items-center gap-2">
                  <Switch checked={projectStatusUpdates} onCheckedChange={(checked) => updateNotificationSettings({ projectStatusUpdates: checked })} />
                  <span className="text-xs text-muted-foreground w-6">{projectStatusUpdates ? "On" : "Off"}</span>
                </div>
              </div>

              {/* Bid due date reminders */}
              <div className="flex items-center justify-between py-2 mb-6">
                <span className="text-sm text-foreground">Bid due date reminders</span>
                <div className="flex items-center gap-2">
                  <Switch checked={bidDueDateReminders} onCheckedChange={(checked) => updateNotificationSettings({ bidDueDateReminders: checked })} />
                  <span className="text-xs text-muted-foreground w-6">{bidDueDateReminders ? "On" : "Off"}</span>
                </div>
              </div>

              {/* Keyword Alerts (Legacy) */}
              <div className="mb-6 p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Saved keywords</span>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        Legacy
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      When new files are posted with keywords of interest
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={keywordAlertsEnabled} onCheckedChange={(checked) => updateNotificationSettings({ keywordAlertsEnabled: checked })} />
                    <span className="text-xs text-muted-foreground w-6">{keywordAlertsEnabled ? "On" : "Off"}</span>
                  </div>
                </div>

                {keywordAlertsEnabled && (
                  <>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded px-3 py-2 mb-3">
                      <Info className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>Saved Search Alerts provide more precise notifications than keyword alerts.</span>
                    </div>

                    <div className="border border-border rounded-md p-3 bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs text-muted-foreground">Enter your keywords here</Label>
                        <button 
                          onClick={() => updateNotificationSettings({ legacyKeywords: [] })}
                          className="text-xs text-primary hover:underline"
                        >
                          clear all saved keywords
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {keywords.map((keyword) => (
                          <Badge 
                            key={keyword}
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20 gap-1 pr-1"
                          >
                            {keyword}
                            <button
                              onClick={() => removeKeyword(keyword)}
                              className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                            >
                              <span className="sr-only">Remove {keyword}</span>
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </Badge>
                        ))}
                        <Input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                          placeholder="Enter a keyword"
                          className="w-32 h-7 text-sm border-dashed"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Notification Priority Info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>When a project matches multiple notification types, you will only receive one notification based on the highest priority.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Notification priority:</span>{" "}
                  <span className="text-primary font-medium">Saved Search Alerts</span>
                  {" → "}
                  <span>Invitation to Bid</span>
                  {" → "}
                  <span>Keyword Alerts</span>
                </div>
              </div>
            </section>

            {/* Company Settings Section */}
            <section className="mt-8 pt-8 border-t border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Company Settings</h2>
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  View your company's coverage area, qualifications and much more.
                </p>
                <Link 
                  href="/settings/company"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  View Company Settings <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
