"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Bell, Filter, Tag, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface OnboardingBannerProps {
  onDismiss: () => void
  onStartSetup: () => void
  onOpenSaveDialog: () => void
  hasFiltersSet: boolean
  hasKeywordsSet: boolean
  hasSavedSearch: boolean
  hasActiveAlert: boolean
  globalAlertsEnabled: boolean
}

export function OnboardingBanner({
  onDismiss,
  onStartSetup,
  onOpenSaveDialog,
  hasFiltersSet,
  hasKeywordsSet,
  hasSavedSearch,
  hasActiveAlert,
  globalAlertsEnabled,
}: OnboardingBannerProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(true)

  const steps = [
    {
      id: "filters",
      label: "Set your filters",
      description: "Choose trades, construction types, and locations",
      icon: Filter,
      complete: hasFiltersSet,
    },
    {
      id: "keywords",
      label: "Add keywords",
      description: "Enter terms like 'concrete', 'renovation', etc.",
      icon: Tag,
      complete: hasKeywordsSet,
    },
    {
      id: "save",
      label: "Save and enable alerts",
      description: "Get email notifications for matching projects",
      icon: Bell,
      complete: hasSavedSearch,
    },
  ]

  const completedSteps = steps.filter(s => s.complete).length
  const allComplete = completedSteps === steps.length

  // If user has active alert AND global alerts are enabled, show thin review notification settings banner
  // Don't show this if global alerts are disabled - the page will show the amber warning instead
  if (hasActiveAlert && globalAlertsEnabled) {
    return (
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-lg">
        <div className="flex items-center gap-3">
          <Bell className="h-4 w-4 text-primary flex-shrink-0" />
          <p className="text-sm text-foreground">
            You have Saved Search Alerts enabled. Consider reviewing your <strong>ITB Notifications</strong> and <strong>Saved Keyword Alerts</strong> to reduce duplicates.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={() => router.push('/settings/account')}
            size="sm"
            variant="default"
            className="h-7 text-xs"
          >
            Review Settings
          </Button>
          <button 
            onClick={onDismiss}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
      >
        <Sparkles className="h-4 w-4" />
        Setup Guide ({completedSteps}/3)
      </button>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20 overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">
                {allComplete ? "You're all set!" : "Set smart project alerts"}
              </h3>
            </div>
            <p className="text-muted-foreground text-xs mb-2">
              {allComplete 
                ? "You've set up your first search alert. You'll receive emails when new matching projects are posted."
                : "Set up your search filters and enable alerts to get notified when new projects match your criteria."
              }
            </p>

            {/* Progress Steps */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      step.complete
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.complete ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Icon className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${step.complete ? 'text-primary' : 'text-foreground'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50 hidden sm:block mt-2" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Alert explanation */}
            <div className="flex items-center gap-2 px-3 py-2 bg-background/60 rounded-lg border border-border">
              <Bell className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">How alerts work:</span>{" "}
                You will receive an email when new projects are posted matching your search filters and keywords.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button 
              onClick={onDismiss}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
            {!allComplete && (
              <Button
                onClick={() => {
                  if (hasFiltersSet || hasKeywordsSet) {
                    // If they have filters/keywords, prompt to save
                    onOpenSaveDialog()
                  } else {
                    // Otherwise open the search panel and scroll to it
                    onStartSetup()
                    setTimeout(() => {
                      document.getElementById('keywords-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }, 100)
                  }
                }}
                size="sm"
                className="whitespace-nowrap"
              >
                {hasFiltersSet || hasKeywordsSet ? "Save Search Alert" : "Get Started"}
              </Button>
            )}
            {allComplete && (
              <Button
                onClick={onDismiss}
                variant="outline"
                size="sm"
              >
                Got it
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${(completedSteps / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
