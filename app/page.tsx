"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronUp, Bell, BellOff, Info } from "lucide-react"
import { PlanHubHeader } from "@/components/planhub-header"
import { SearchFiltersPanel, type FilterState } from "@/components/search-filters"
import { KeywordChips } from "@/components/keyword-chips"
import { ManageSearchesModal } from "@/components/manage-searches-modal"
import { SaveSearchDialog } from "@/components/save-search-dialog"
import { SaveOptionsModal } from "@/components/save-options-modal"
import { OnboardingBanner } from "@/components/onboarding-banner"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSettings, emptyFilters } from "@/lib/settings-context"

export default function ProjectsPage() {
  const router = useRouter()
  
  // Use shared settings context
  const {
    notificationSettings,
    savedSearches,
    createSearch,
    updateSearch,
    deleteSearch,
    toggleAlert,
    updateFrequency,
    maxAlerts,
    enabledAlertsCount,
    canEnableMoreAlerts,
    hasActiveAlert,
    showOnboarding,
    setShowOnboarding,
    showReviewBanner,
    setShowReviewBanner,
  } = useSettings()

  // Local UI state
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true)
  const [keywords, setKeywords] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null)
  const [searchMode, setSearchMode] = useState<"keyword" | "document">("keyword")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [showSaveOptionsModal, setShowSaveOptionsModal] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Get active search if one is selected
  const activeSearch = activeSearchId 
    ? savedSearches.find(s => s.id === activeSearchId) 
    : null

  // Count active filters
  const activeFilterCount = 
    Object.values(filters).filter((v) => 
      Array.isArray(v) ? v.length > 0 : v !== ""
    ).length + (keywords.length > 0 ? 1 : 0)

  // Check if current state differs from active search
  const checkForChanges = useCallback((newFilters: FilterState, newKeywords: string[]) => {
    if (!activeSearch) {
      setHasUnsavedChanges(false)
      return
    }
    
    const filtersMatch = JSON.stringify(newFilters) === JSON.stringify(activeSearch.filters)
    const keywordsMatch = JSON.stringify(newKeywords) === JSON.stringify(activeSearch.keywords)
    setHasUnsavedChanges(!filtersMatch || !keywordsMatch)
  }, [activeSearch])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    checkForChanges(newFilters, keywords)
  }

  const handleKeywordsChange = (newKeywords: string[]) => {
    setKeywords(newKeywords)
    checkForChanges(filters, newKeywords)
  }

  // Load a saved search into the filters
  const handleLoadSearch = (search: SavedSearch) => {
    setActiveSearchId(search.id)
    setFilters(search.filters)
    setKeywords(search.keywords)
    setHasUnsavedChanges(false)
    setShowManageModal(false)
  }

  // Clear filters and deselect any active search
  const handleResetSearches = () => {
    setActiveSearchId(null)
    setFilters(emptyFilters)
    setKeywords([])
    setHasUnsavedChanges(false)
  }

  // Create a new saved search
  const handleCreateSearch = (name: string, alertEnabled: boolean, alertFrequency: "daily" | "weekly" | "instant") => {
    const newSearch = createSearch(name, alertEnabled, alertFrequency, filters, keywords)
    setActiveSearchId(newSearch.id)
    setHasUnsavedChanges(false)
  }

  // Update the currently active search
  const handleUpdateSearch = () => {
    if (!activeSearchId) return
    updateSearch(activeSearchId, { filters, keywords })
    setHasUnsavedChanges(false)
  }

  // Toggle alert for a search
  const handleToggleAlert = (id: string, enabled: boolean) => {
    // Check if we can enable more alerts
    if (enabled && !canEnableMoreAlerts) {
      return // Can't enable more alerts
    }
    toggleAlert(id, enabled)
  }

  // Delete a saved search
  const handleDeleteSearch = (id: string) => {
    deleteSearch(id)
    if (activeSearchId === id) {
      setActiveSearchId(null)
      setFilters(emptyFilters)
      setKeywords([])
    }
  }

  // Update alert frequency
  const handleUpdateFrequency = (id: string, frequency: "daily" | "weekly" | "instant") => {
    updateFrequency(id, frequency)
  }

  const handleDismissOnboarding = () => {
    setShowOnboarding(false)
    // In a real app, you would save this preference to the user's profile
    // localStorage.setItem('planhub_onboarding_complete', 'true')
  }

  // Check completion states for onboarding
  const hasFiltersSet = Object.values(filters).some((v) => 
    Array.isArray(v) ? v.length > 0 : v !== ""
  )
  const hasKeywordsSet = keywords.length > 0
  const hasSavedSearch = savedSearches.length > 0

  // Check if global saved search alerts are enabled
  const globalAlertsEnabled = notificationSettings.savedSearchAlertsEnabled

  return (
    <div className="min-h-screen bg-background">
      <PlanHubHeader />

      {/* Main Content - Full Width */}
      <main className="px-4 sm:px-6 py-6 w-full">
        {/* Onboarding Banner - Shows setup guide OR review settings banner (only when global alerts enabled) */}
        {(showOnboarding || (hasActiveAlert && globalAlertsEnabled && showReviewBanner)) && (
          <div className="mb-6">
            <OnboardingBanner
              onDismiss={() => {
                if (hasActiveAlert) {
                  setShowReviewBanner(false)
                }
                setShowOnboarding(false)
              }}
              onStartSetup={() => setIsAdvancedOpen(true)}
              onOpenSaveDialog={() => setShowSaveDialog(true)}
              hasFiltersSet={hasFiltersSet}
              hasKeywordsSet={hasKeywordsSet}
              hasSavedSearch={hasSavedSearch}
              hasActiveAlert={hasActiveAlert}
              globalAlertsEnabled={globalAlertsEnabled}
            />
          </div>
        )}

        {/* Global Alerts Disabled Warning */}
        {!globalAlertsEnabled && hasActiveAlert && (
          <div className="mb-4 flex items-center justify-between gap-4 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-3">
              <BellOff className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Saved Search Alerts are disabled</strong> in your notification settings. You have {savedSearches.filter(s => s.alertEnabled).length} search(es) with alerts enabled but you won&apos;t receive notifications.
              </p>
            </div>
            <Button
              onClick={() => router.push('/settings/account')}
              size="sm"
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100 flex-shrink-0"
            >
              Enable in Settings
            </Button>
          </div>
        )}

        {/* Go to Planner / Export Buttons */}
        <div className="flex justify-end gap-3 mb-4">
          <Button variant="outline">Go to Planner</Button>
          <Button className="bg-primary text-primary-foreground">Export Projects</Button>
        </div>

        {/* Advanced Search Panel */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <div className="border rounded-lg bg-card">
            {/* Progress bar style header */}
            <div className="h-1.5 bg-primary rounded-t-lg" />
            
            <CollapsibleTrigger asChild>
              <button className="w-full px-4 py-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-border">
                <span>Advanced search</span>
                {activeFilterCount > 0 && (
                  <span>({activeFilterCount})</span>
                )}
                <ChevronUp
                  className={`h-4 w-4 transition-transform ${isAdvancedOpen ? "" : "rotate-180"}`}
                />
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="p-5 space-y-5">
                {/* Header Row: Search Name on left, Actions on right */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-primary font-medium">
                      Search: {activeSearch ? activeSearch.name : "No filters or keywords"}
                    </span>
                    {activeSearch && (
                      <div className="flex items-center gap-2">
                        {activeSearch.alertEnabled ? (
                          <Badge 
                            variant="secondary" 
                            className={`gap-1.5 font-normal cursor-pointer ${
                              globalAlertsEnabled 
                                ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" 
                                : "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
                            }`}
                            onClick={() => handleToggleAlert(activeSearch.id, false)}
                          >
                            {globalAlertsEnabled ? (
                              <Bell className="h-3 w-3" />
                            ) : (
                              <BellOff className="h-3 w-3" />
                            )}
                            Alerts: {activeSearch.alertFrequency}
                            {!globalAlertsEnabled && " (paused)"}
                          </Badge>
                        ) : (
                          <Badge 
                            variant="secondary" 
                            className="bg-muted text-muted-foreground gap-1.5 font-normal cursor-pointer hover:bg-muted/80"
                            onClick={() => handleToggleAlert(activeSearch.id, true)}
                          >
                            <BellOff className="h-3 w-3" />
                            Alerts off
                          </Badge>
                        )}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs">
                              <p>You will receive an email when new projects are posted matching your search filters and keywords.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                    {hasUnsavedChanges && (
                      <span className="text-amber-600">(unsaved changes)</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm flex-wrap justify-end">
                    {/* Alerts counter */}
                    <span className={`px-2 ${!canEnableMoreAlerts ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}>
                      {enabledAlertsCount}/{maxAlerts} alerts
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <button 
                      onClick={() => {
                        if (activeSearch && hasUnsavedChanges) {
                          // Show options modal when editing with unsaved changes
                          setShowSaveOptionsModal(true)
                        } else {
                          // Go directly to save dialog for new searches
                          setShowSaveDialog(true)
                        }
                      }}
                      disabled={activeFilterCount === 0}
                      className={`text-primary hover:underline px-2 ${activeFilterCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      + Save Searches
                    </button>
                    <span className="text-muted-foreground">|</span>
                    <button 
                      onClick={() => setShowManageModal(true)}
                      className="text-primary hover:underline px-2"
                    >
                      View Saved Searches
                    </button>
                    <span className="text-muted-foreground">|</span>
                    <button 
                      onClick={handleResetSearches}
                      className="text-primary hover:underline px-2"
                    >
                      Reset Searches
                    </button>
                  </div>
                </div>

                {/* Alert Limit Reached Warning */}
                {!canEnableMoreAlerts && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800">
                        Alert limit reached ({maxAlerts}/{maxAlerts})
                      </p>
                      <p className="text-xs text-amber-600">
                        Disable an existing alert to enable alerts on another saved search.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowManageModal(true)}
                      className="border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                      Manage Alerts
                    </Button>
                  </div>
                )}

                {/* Search Mode Toggle */}
                <div className="flex items-center gap-4">
                  <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "keyword" | "document")} className="w-fit">
                    <TabsList className="bg-muted h-9">
                      <TabsTrigger
                        value="keyword"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs px-4"
                      >
                        Search documents by keyword
                      </TabsTrigger>
                      <TabsTrigger
                        value="document"
                        className="text-xs px-4"
                      >
                        or projects by name
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Keywords Section */}
                <div id="keywords-section" className="space-y-2">
                  <div className="text-sm font-medium text-primary">Keywords:</div>
                  <KeywordChips
                    keywords={keywords}
                    onKeywordsChange={handleKeywordsChange}
                    maxKeywords={10}
                  />
                </div>

                {/* Filters Section */}
                <SearchFiltersPanel filters={filters} onFiltersChange={handleFiltersChange} />

                {/* Bottom Action Row */}
                <div className="flex items-center justify-end pt-4 border-t border-border">
                  <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Results Preview */}
        <div className="mt-6 border rounded-lg bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">PlanHub Projects</span>
              <span className="text-sm text-muted-foreground">| 875 total</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Go to page</span>
              <input 
                type="text" 
                defaultValue="1" 
                className="w-10 h-7 text-center border rounded text-foreground"
              />
              <span>Page 1 of 88</span>
              <span className="flex gap-1">
                <button className="px-2 hover:text-foreground">{"<"}</button>
                <button className="px-2 hover:text-foreground">{">"}</button>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-sm text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">Project</th>
                <th className="text-left px-4 py-3 font-medium">Bid Date</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">Distance</th>
                <th className="text-left px-4 py-3 font-medium">Documents</th>
                <th className="text-left px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { name: "Top Pot Doughnuts Foundry Cafe TI", date: "05/08/2026", location: "Kent, Washington", distance: "1231 miles", docs: "Matches Found" },
                { name: "Microsoft Campus Building 44 Expansion", date: "05/12/2026", location: "Redmond, Washington", distance: "1225 miles", docs: "Available" },
                { name: "Seattle Children's Hospital Wing", date: "05/15/2026", location: "Seattle, Washington", distance: "1220 miles", docs: "Available" },
              ].map((project, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{project.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{project.date}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{project.location}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{project.distance}</td>
                  <td className="px-4 py-3 text-sm text-primary">{project.docs}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" className="text-xs">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </main>

      {/* Manage Searches Modal */}
      <ManageSearchesModal
        open={showManageModal}
        onOpenChange={setShowManageModal}
        savedSearches={savedSearches}
        activeSearchId={activeSearchId}
        maxAlerts={maxAlerts}
        enabledAlertsCount={enabledAlertsCount}
        canEnableMoreAlerts={canEnableMoreAlerts}
        onSelectSearch={handleLoadSearch}
        onToggleAlert={handleToggleAlert}
        onDeleteSearch={handleDeleteSearch}
        onUpdateFrequency={handleUpdateFrequency}
      />

      {/* Save Search Dialog */}
<SaveSearchDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleCreateSearch}
        filterCount={Object.values(filters).filter((v) => 
          Array.isArray(v) ? v.length > 0 : v !== ""
        ).length}
        keywordCount={keywords.length}
        canEnableMoreAlerts={canEnableMoreAlerts}
        enabledAlertsCount={enabledAlertsCount}
        maxAlerts={maxAlerts}
      />

      {/* Save Options Modal - Shows when editing with unsaved changes */}
      <SaveOptionsModal
        open={showSaveOptionsModal}
        onOpenChange={setShowSaveOptionsModal}
        onSave={handleUpdateSearch}
        onSaveAsNew={() => setShowSaveDialog(true)}
        searchName={activeSearch?.name || ""}
      />
    </div>
  )
}
