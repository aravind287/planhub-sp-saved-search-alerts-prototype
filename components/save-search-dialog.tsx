"use client"

import { useState } from "react"
import { Bell, Clock, Zap, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SaveSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string, alertEnabled: boolean, alertFrequency: "daily" | "weekly" | "instant") => void
  filterCount: number
  keywordCount: number
  canEnableMoreAlerts: boolean
  enabledAlertsCount: number
  maxAlerts: number
}

export function SaveSearchDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  filterCount, 
  keywordCount,
  canEnableMoreAlerts,
  enabledAlertsCount,
  maxAlerts,
}: SaveSearchDialogProps) {
  const [name, setName] = useState("")
  const [alertEnabled, setAlertEnabled] = useState(canEnableMoreAlerts)
  const [alertFrequency, setAlertFrequency] = useState<"instant" | "daily" | "weekly">("daily")

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), alertEnabled, alertFrequency)
      setName("")
      setAlertEnabled(true)
      setAlertFrequency("daily")
      onOpenChange(false)
    }
  }

  const frequencyOptions = [
    {
      value: "instant" as const,
      label: "Instant",
      description: "Get notified immediately when a matching project is posted",
      icon: Zap,
    },
    {
      value: "daily" as const,
      label: "Daily Summary",
      description: "Receive a daily digest of all matching projects",
      icon: Clock,
    },
    {
      value: "weekly" as const,
      label: "Weekly Summary",
      description: "Receive a weekly digest every Monday",
      icon: Calendar,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Bell className="h-5 w-5 text-primary" />
            Save Search
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Never miss a project. Enable email alerts to get notified when new matching projects are posted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Search Name */}
          <div className="space-y-2">
            <Label htmlFor="search-name" className="text-foreground">Search Name</Label>
            <Input
              id="search-name"
              placeholder="e.g., Concrete Projects - Seattle Area"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-input border-border"
              autoFocus
            />
          </div>

          {/* Filter Summary */}
          <div className="space-y-2">
            <Label className="text-foreground">Search includes</Label>
            <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 rounded-lg border border-border">
              {filterCount > 0 && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {filterCount} filter{filterCount !== 1 ? "s" : ""}
                </Badge>
              )}
              {keywordCount > 0 && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {keywordCount} keyword{keywordCount !== 1 ? "s" : ""}
                </Badge>
              )}
              {filterCount === 0 && keywordCount === 0 && (
                <span className="text-sm text-muted-foreground">No filters selected</span>
              )}
            </div>
          </div>

          {/* Alert Toggle */}
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Enable Email Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Get notified when matching projects are posted
                </p>
                {!canEnableMoreAlerts && (
                  <p className="text-xs text-amber-600 mt-1">
                    Alert limit reached ({enabledAlertsCount}/{maxAlerts}). Disable an existing alert to enable this one.
                  </p>
                )}
              </div>
            </div>
            <Switch
              checked={alertEnabled}
              onCheckedChange={setAlertEnabled}
              disabled={!canEnableMoreAlerts && !alertEnabled}
            />
          </div>

          {/* Alert Frequency */}
          {alertEnabled && (
            <div className="space-y-2">
              <Label className="text-foreground">Alert Frequency</Label>
              <div className="space-y-2">
                {frequencyOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      alertFrequency === option.value
                        ? "bg-primary/10 border-primary"
                        : "bg-secondary/30 border-border hover:border-primary/50"
                    )}
                    onClick={() => setAlertFrequency(option.value)}
                  >
                    <div
                      className={cn(
                        "mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center",
                        alertFrequency === option.value
                          ? "border-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {alertFrequency === option.value && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <option.icon
                          className={cn(
                            "h-4 w-4",
                            alertFrequency === option.value
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                        <span className="text-sm font-medium text-foreground">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
