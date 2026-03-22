"use client"

import { useState } from "react"
import { Search, Trash2, Bell, BellOff, ChevronDown, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { FilterState } from "@/components/search-filters"

export interface SavedSearch {
  id: string
  name: string
  alertEnabled: boolean
  alertFrequency: "daily" | "weekly" | "instant"
  filters: FilterState
  keywords: string[]
  matchCount: number
  lastUpdated: string
}

interface ManageSearchesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  savedSearches: SavedSearch[]
  activeSearchId: string | null
  maxAlerts: number
  enabledAlertsCount: number
  canEnableMoreAlerts: boolean
  onSelectSearch: (search: SavedSearch) => void
  onToggleAlert: (id: string, enabled: boolean) => void
  onDeleteSearch: (id: string) => void
  onUpdateFrequency: (id: string, frequency: "daily" | "weekly" | "instant") => void
}

export function ManageSearchesModal({
  open,
  onOpenChange,
  savedSearches,
  activeSearchId,
  maxAlerts,
  enabledAlertsCount,
  canEnableMoreAlerts,
  onSelectSearch,
  onToggleAlert,
  onDeleteSearch,
  onUpdateFrequency,
}: ManageSearchesModalProps) {
  const isAtAlertLimit = !canEnableMoreAlerts
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSearches = savedSearches.filter((search) =>
    search.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectSearch = (search: SavedSearch) => {
    onSelectSearch(search)
    onOpenChange(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">My Searches &amp; Alerts</DialogTitle>
            <Badge 
              variant="secondary" 
              className={isAtAlertLimit 
                ? "bg-amber-100 text-amber-700 border-amber-200" 
                : "bg-muted text-muted-foreground"
              }
            >
              {enabledAlertsCount}/{maxAlerts} alerts
            </Badge>
          </div>
          <DialogDescription>
            Manage your saved searches and email alert preferences.
            {isAtAlertLimit && (
              <span className="block mt-1 text-amber-600">
                You have reached the maximum number of alerts. Disable one to enable alerts on another search.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Input
              placeholder="Search Saved Searches"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Searches List */}
        <div className="border-t max-h-[400px] overflow-y-auto">
          {filteredSearches.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              {searchQuery ? "No matching searches found" : "No saved searches yet"}
            </div>
          ) : (
            <div className="divide-y">
              {filteredSearches.map((search) => (
                <div
                  key={search.id}
                  className={`flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors ${
                    activeSearchId === search.id ? "bg-primary/5" : ""
                  }`}
                >
                  {/* Search Info - Clickable to load */}
                  <button
                    onClick={() => handleSelectSearch(search)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{search.name}</span>
                      {activeSearchId === search.id && (
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {search.matchCount} projects - Updated {formatDate(search.lastUpdated)}
                    </div>
                  </button>

                  {/* Alert Status & Frequency */}
                  <div className="flex items-center gap-2">
                    {search.alertEnabled ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-1 text-primary h-8">
                            <Bell className="h-4 w-4" />
                            <span className="text-xs capitalize">{search.alertFrequency}</span>
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onUpdateFrequency(search.id, "instant")}>
                            Instant
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateFrequency(search.id, "daily")}>
                            Daily
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateFrequency(search.id, "weekly")}>
                            Weekly
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onToggleAlert(search.id, false)}
                            className="text-muted-foreground"
                          >
                            <BellOff className="h-4 w-4 mr-2" />
                            Turn off alerts
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleAlert(search.id, true)}
                        disabled={!canEnableMoreAlerts}
                        className="text-muted-foreground h-8"
                        title={!canEnableMoreAlerts ? "Alert limit reached" : "Enable alerts"}
                      >
                        <BellOff className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectSearch(search)}
                    className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                    title="Edit search"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteSearch(search.id)}
                    className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                    title="Delete search"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
