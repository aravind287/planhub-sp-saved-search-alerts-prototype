"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronUp, Bell, BellOff, Info } from "lucide-react"

const NEW_DAYS = 7

interface Project {
  id: string
  name: string
  date: string
  location: string
  distance: string
  docs: string
  datePosted: string
  stage: string
  value: string
}

const ALL_PROJECTS: Project[] = [
  { id: "p1",  name: "Top Pot Doughnuts Foundry Cafe TI",          date: "05/08/2026", location: "Kent, Washington",        distance: "12 miles",  docs: "Matches Found", datePosted: "2026-03-15", stage: "Bidding",  value: "$240K"  },
  { id: "p2",  name: "Microsoft Campus Building 44 Expansion",      date: "05/12/2026", location: "Redmond, Washington",     distance: "18 miles",  docs: "Available",     datePosted: "2026-03-14", stage: "Pre-Bid",  value: "$4.2M"  },
  { id: "p3",  name: "Seattle Children's Hospital Wing C",           date: "05/15/2026", location: "Seattle, Washington",     distance: "8 miles",   docs: "Available",     datePosted: "2026-03-16", stage: "Bidding",  value: "$12M"   },
  { id: "p4",  name: "Tacoma Public Library Renovation",             date: "05/20/2026", location: "Tacoma, Washington",      distance: "28 miles",  docs: "Matches Found", datePosted: "2026-03-17", stage: "Bidding",  value: "$1.8M"  },
  { id: "p5",  name: "Auburn School District HVAC Upgrade",          date: "05/25/2026", location: "Auburn, Washington",      distance: "22 miles",  docs: "Available",     datePosted: "2026-03-10", stage: "Pre-Bid",  value: "$890K"  },
  { id: "p6",  name: "Bellevue Tech Campus Phase 2",                 date: "06/01/2026", location: "Bellevue, Washington",    distance: "14 miles",  docs: "Matches Found", datePosted: "2026-03-08", stage: "Bidding",  value: "$28M"   },
  { id: "p7",  name: "Renton Community Center Addition",             date: "06/05/2026", location: "Renton, Washington",      distance: "16 miles",  docs: "Available",     datePosted: "2026-03-05", stage: "Bidding",  value: "$3.4M"  },
  { id: "p8",  name: "Federal Way Fire Station No. 63",              date: "06/10/2026", location: "Federal Way, Washington", distance: "24 miles",  docs: "Available",     datePosted: "2026-02-28", stage: "Pre-Bid",  value: "$5.1M"  },
  { id: "p9",  name: "Kirkland Waterfront Mixed-Use Development",    date: "06/15/2026", location: "Kirkland, Washington",    distance: "20 miles",  docs: "Matches Found", datePosted: "2026-02-20", stage: "Bidding",  value: "$67M"   },
  { id: "p10", name: "Everett Naval Station Barracks Renovation",    date: "06/18/2026", location: "Everett, Washington",     distance: "32 miles",  docs: "Available",     datePosted: "2026-02-15", stage: "Awarded",  value: "$18M"   },
  { id: "p11", name: "Bothell Medical Office Building",              date: "06/22/2026", location: "Bothell, Washington",     distance: "26 miles",  docs: "Matches Found", datePosted: "2026-03-12", stage: "Pre-Bid",  value: "$7.6M"  },
  { id: "p12", name: "Shoreline Light Rail Station Parking Garage",  date: "06/28/2026", location: "Shoreline, Washington",   distance: "10 miles",  docs: "Available",     datePosted: "2026-03-01", stage: "Bidding",  value: "$14M"   },
  { id: "p13", name: "Redmond Elementary School Rebuild",            date: "07/01/2026", location: "Redmond, Washington",     distance: "19 miles",  docs: "Available",     datePosted: "2026-03-16", stage: "Pre-Bid",  value: "$22M"   },
  { id: "p14", name: "Issaquah Senior Living Facility",              date: "07/08/2026", location: "Issaquah, Washington",    distance: "25 miles",  docs: "Matches Found", datePosted: "2026-03-13", stage: "Bidding",  value: "$31M"   },
  { id: "p15", name: "Kent Warehouse Distribution Center",           date: "07/15/2026", location: "Kent, Washington",        distance: "15 miles",  docs: "Available",     datePosted: "2026-02-10", stage: "Bidding",  value: "$9.8M"  },
]

function isProjectNew(datePosted: string): boolean {
  const posted = new Date(datePosted)
  const diffMs = new Date().getTime() - posted.getTime()
  return diffMs / (1000 * 60 * 60 * 24) <= NEW_DAYS
}

function parseBidDate(dateStr: string): number {
  const [month, day, year] = dateStr.split("/")
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime()
}

const SORTED_PROJECTS = [...ALL_PROJECTS].sort((a, b) => parseBidDate(b.date) - parseBidDate(a.date))
import { PlanHubHeader } from "@/components/planhub-header"
import { SearchFiltersPanel, type FilterState } from "@/components/search-filters"
import { KeywordChips } from "@/components/keyword-chips"
import { ManageSearchesModal, type SavedSearch } from "@/components/manage-searches-modal"
import { SaveSearchDialog } from "@/components/save-search-dialog"
import { SaveOptionsModal } from "@/components/save-options-modal"
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

  // What's New state
  const [viewedProjectIds, setViewedProjectIds] = useState<Set<string>>(new Set())
  const [showNewOnly, setShowNewOnly] = useState(false)

  const newProjectIds = useMemo(
    () => new Set(SORTED_PROJECTS.filter(p => isProjectNew(p.datePosted)).map(p => p.id)),
    []
  )
  const unreadCount = SORTED_PROJECTS.filter(p => newProjectIds.has(p.id) && !viewedProjectIds.has(p.id)).length
  const displayedProjects = showNewOnly
    ? SORTED_PROJECTS.filter(p => newProjectIds.has(p.id) && !viewedProjectIds.has(p.id))
    : SORTED_PROJECTS

  const markViewed = (id: string) => setViewedProjectIds(prev => new Set(prev).add(id))


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

  // Check if global saved search alerts are enabled
  const globalAlertsEnabled = notificationSettings.savedSearchAlertsEnabled

  return (
    <div className="min-h-screen bg-background">
      <PlanHubHeader />

      {/* Main Content - Full Width */}
      <main className="px-4 sm:px-6 py-6 w-full">

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
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (activeSearch && hasUnsavedChanges) {
                            setShowSaveOptionsModal(true)
                          } else {
                            setShowSaveDialog(true)
                          }
                        }}
                        disabled={activeFilterCount === 0}
                        className={`text-primary hover:underline px-2 ${activeFilterCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        + Save Searches
                      </button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700 cursor-default select-none">
                              NEW
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="start" className="max-w-[240px] p-3">
                            <p className="font-semibold text-sm mb-1">New Saved Search Alerts</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Set up your search filters and enable alerts to get notified when new projects match your criteria.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">PlanHub Projects</span>
              <span className="text-sm text-muted-foreground">| {SORTED_PROJECTS.length} total</span>
              <button
                onClick={() => setShowNewOnly(!showNewOnly)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  showNewOnly
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : unreadCount > 0
                    ? "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    : "bg-muted text-muted-foreground border-border opacity-50 cursor-default"
                }`}
                disabled={unreadCount === 0 && !showNewOnly}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${unreadCount > 0 ? "bg-blue-500" : "bg-muted-foreground"}`} />
                {unreadCount} new
              </button>
              {showNewOnly && (
                <span className="text-xs text-muted-foreground">
                  Showing {displayedProjects.length} unread
                </span>
              )}
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
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-border bg-muted/30">
                <tr className="text-sm text-muted-foreground">
                  <th className="text-left px-4 py-3 font-medium">Project</th>
                  <th className="text-left px-4 py-3 font-medium">Bid Date</th>
                  <th className="text-left px-4 py-3 font-medium">Location</th>
                  <th className="text-left px-4 py-3 font-medium">Distance</th>
                  <th className="text-left px-4 py-3 font-medium">Est. Value</th>
                  <th className="text-left px-4 py-3 font-medium">Documents</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No new unread projects. Turn off the filter to see all projects.
                    </td>
                  </tr>
                ) : (
                  displayedProjects.map((project) => {
                    const isNew = newProjectIds.has(project.id)
                    const isUnread = isNew && !viewedProjectIds.has(project.id)
                    return (
                      <tr
                        key={project.id}
                        className={`hover:bg-muted/30 transition-colors ${isUnread ? "bg-blue-50/40" : ""}`}
                      >
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" title="New — not yet viewed" />
                            )}
                            <span className={`font-medium ${isUnread ? "text-foreground" : "text-muted-foreground"}`}>
                              {project.name}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              project.stage === "Awarded"
                                ? "bg-green-100 text-green-700"
                                : project.stage === "Pre-Bid"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-primary/10 text-primary"
                            }`}>
                              {project.stage}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{project.date}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{project.location}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{project.distance}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{project.value}</td>
                        <td className="px-4 py-3 text-sm text-primary">{project.docs}</td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => markViewed(project.id)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
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
