"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronUp, Bell, BellOff, Info, X, ChevronsUpDown, ChevronDown } from "lucide-react"
import { ALL_PROJECTS } from "@/lib/mock-projects"
import { getCompanyDistanceLabel, getCompanyDistance, distanceFromZip } from "@/lib/geo-utils"
import { PROJECT_DOCUMENTS } from "@/lib/mock-documents"
import { ProjectSidePanel } from "@/components/project-side-panel"
import { MatchingDocumentsModal } from "@/components/matching-documents-modal"
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

const NEW_DAYS = 7

function isProjectNew(datePosted: string): boolean {
  const posted = new Date(datePosted)
  const diffMs = new Date().getTime() - posted.getTime()
  return diffMs / (1000 * 60 * 60 * 24) <= NEW_DAYS
}

function parseBidDate(dateStr: string): number {
  const [month, day, year] = dateStr.split("/")
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime()
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

const SORTED_PROJECTS = [...ALL_PROJECTS]

type SortField = "bid-date" | "project-name" | "distance"
type SortDir = "asc" | "desc"

function SortableHeader({ label, field, sortField, sortDir, onSort }: {
  label: string
  field: SortField
  sortField: SortField
  sortDir: SortDir
  onSort: (f: SortField) => void
}) {
  const isActive = field === sortField
  return (
    <th
      className="text-left px-4 py-3 font-medium cursor-pointer select-none hover:text-foreground"
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive
          ? sortDir === "asc"
            ? <ChevronUp className="h-3.5 w-3.5 text-primary" />
            : <ChevronDown className="h-3.5 w-3.5 text-primary" />
          : <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
        }
      </span>
    </th>
  )
}

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
    showReviewBanner,
    setShowReviewBanner,
  } = useSettings()

  // Local UI state
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true)
  const [keywords, setKeywords] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  // Applied state — only updated on Search click
  const [appliedKeywords, setAppliedKeywords] = useState<string[]>([])
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(emptyFilters)
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null)
  const [searchMode, setSearchMode] = useState<"keyword" | "document">("keyword")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [showSaveOptionsModal, setShowSaveOptionsModal] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  // Side panel & documents modal
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [docsModalProjectId, setDocsModalProjectId] = useState<string | null>(null)
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 10
  // Sorting — default bid date descending
  const [sortField, setSortField] = useState<SortField>("bid-date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  // New callout state — open by default
  const [showNewCallout, setShowNewCallout] = useState(true)

  // What's New state
  const [viewedProjectIds, setViewedProjectIds] = useState<Set<string>>(new Set())
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [datePostedFilter, setDatePostedFilter] = useState<"" | "today" | "last-7" | "last-30">("")

  const newProjectIds = useMemo(
    () => new Set(SORTED_PROJECTS.filter(p => isProjectNew(p.datePosted)).map(p => p.id)),
    []
  )

  const filteredProjects = useMemo(() => {
    let result = SORTED_PROJECTS

    // Keyword search — match against project name or project keywords
    if (appliedKeywords.length > 0) {
      result = result.filter(p =>
        appliedKeywords.some(kw => {
          const q = kw.toLowerCase()
          return p.name.toLowerCase().includes(q) ||
            p.keywords.some(pk => pk.toLowerCase().includes(q))
        })
      )
    }

    // Trades
    if (appliedFilters.tradesSubtrades.length > 0) {
      result = result.filter(p =>
        p.trades.some(t => appliedFilters.tradesSubtrades.includes(t))
      )
    }

    // Construction type
    if (appliedFilters.constructionType.length > 0) {
      result = result.filter(p => appliedFilters.constructionType.includes(p.constructionType))
    }

    // Building use
    if (appliedFilters.projectBuildingUse.length > 0) {
      result = result.filter(p => appliedFilters.projectBuildingUse.includes(p.buildingUse))
    }

    // Project types
    if (appliedFilters.projectTypes.length > 0) {
      result = result.filter(p => appliedFilters.projectTypes.includes(p.projectType))
    }

    // Regions (states)
    if (appliedFilters.regions.length > 0) {
      result = result.filter(p => appliedFilters.regions.includes(p.state))
    }

    // Counties
    if (appliedFilters.counties.length > 0) {
      result = result.filter(p =>
        appliedFilters.counties.includes(`${p.state}:${p.county}`)
      )
    }

    // Status
    if (appliedFilters.status.length > 0) {
      const now = new Date()
      result = result.filter(p => {
        const bidDate = new Date(parseBidDate(p.date))
        const isClosingSoon = p.stage === "Bidding" && bidDate <= addDays(now, 7)
        const isRecentlyPosted = isProjectNew(p.datePosted)
        return appliedFilters.status.some(s => {
          if (s === "awarded") return p.stage === "Awarded"
          if (s === "closing-soon") return isClosingSoon
          if (s === "recently-posted") return isRecentlyPosted
          if (s === "open") return p.stage === "Bidding" || p.stage === "Pre-Bid"
          return false
        })
      })
    }

    // Labor status
    if (appliedFilters.sectorLaborStatus.length > 0) {
      result = result.filter(p => appliedFilters.sectorLaborStatus.includes(p.laborStatus))
    }

    // Bid due date — preset
    if (appliedFilters.bidDueDate && appliedFilters.bidDueDate !== "custom") {
      const now = new Date()
      result = result.filter(p => {
        const bid = new Date(parseBidDate(p.date))
        switch (appliedFilters.bidDueDate) {
          case "next-7-days":  return bid >= now && bid <= addDays(now, 7)
          case "next-14-days": return bid >= now && bid <= addDays(now, 14)
          case "next-30-days": return bid >= now && bid <= addDays(now, 30)
          case "next-60-days": return bid >= now && bid <= addDays(now, 60)
          case "past-due":     return bid < now && bid >= addDays(now, -60)
          default: return true
        }
      })
    } else if (appliedFilters.bidDueDate === "custom" && appliedFilters.bidDateFrom) {
      const from = new Date(appliedFilters.bidDateFrom)
      const to = appliedFilters.bidDateTo ? new Date(appliedFilters.bidDateTo) : new Date("2099-12-31")
      result = result.filter(p => {
        const bid = new Date(parseBidDate(p.date))
        return bid >= from && bid <= to
      })
    }

    // Zip code + distance radius
    if (appliedFilters.zipCode.trim() && appliedFilters.distance) {
      const maxMiles = parseInt(appliedFilters.distance)
      result = result.filter(p => {
        const d = distanceFromZip(appliedFilters.zipCode, p.location)
        return d !== null && d <= maxMiles
      })
    }

    return result
  }, [appliedKeywords, appliedFilters])

  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      let cmp = 0
      if (sortField === "bid-date") {
        cmp = parseBidDate(a.date) - parseBidDate(b.date)
      } else if (sortField === "project-name") {
        cmp = a.name.localeCompare(b.name)
      } else if (sortField === "distance") {
        const da = getCompanyDistance(a.location) ?? 99999
        const db = getCompanyDistance(b.location) ?? 99999
        cmp = da - db
      }
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [filteredProjects, sortField, sortDir])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("asc")
    }
    setCurrentPage(1)
  }

  const baseProjects = (() => {
    let base = showNewOnly
      ? sortedProjects.filter(p => newProjectIds.has(p.id) && !viewedProjectIds.has(p.id))
      : sortedProjects
    if (datePostedFilter) {
      const now = new Date()
      const cutoff = datePostedFilter === "today"
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
        : datePostedFilter === "last-7"
        ? addDays(now, -7)
        : addDays(now, -30)
      base = base.filter(p => new Date(p.datePosted) >= cutoff)
    }
    return base
  })()
  const unreadCount = filteredProjects.filter(p => newProjectIds.has(p.id) && !viewedProjectIds.has(p.id)).length
  const pageCount = Math.max(1, Math.ceil(baseProjects.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, pageCount)
  const displayedProjects = baseProjects.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, pageCount)))

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

  // Load a saved search into the filters and apply immediately
  const handleLoadSearch = (search: SavedSearch) => {
    setActiveSearchId(search.id)
    setFilters(search.filters)
    setKeywords(search.keywords)
    setAppliedFilters(search.filters)
    setAppliedKeywords(search.keywords)
    setHasUnsavedChanges(false)
    setShowManageModal(false)
    setSelectedProjectId(null)
  }

  const handleSearch = () => {
    setAppliedKeywords(keywords)
    setAppliedFilters(filters)
    setSelectedProjectId(null)
    setCurrentPage(1)
  }

  // Clear filters and deselect any active search
  const handleResetSearches = () => {
    setActiveSearchId(null)
    setFilters(emptyFilters)
    setKeywords([])
    setAppliedFilters(emptyFilters)
    setAppliedKeywords([])
    setSelectedProjectId(null)
    setCurrentPage(1)
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

        {/* Review Settings Banner — shown once user has an active alert with global alerts enabled */}
        {hasActiveAlert && globalAlertsEnabled && showReviewBanner && (
          <div className="mb-4 flex items-center justify-between gap-4 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-lg">
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
                onClick={() => setShowReviewBanner(false)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
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
                              <p className="font-semibold text-sm mb-1">Never miss a project</p>
                              <p>Set up your filters and keywords and enable email alerts to get notified when matching projects are posted.</p>
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
                      {enabledAlertsCount}/{maxAlerts} email alerts
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <div className="relative flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (activeSearch && hasUnsavedChanges) {
                            setShowSaveOptionsModal(true)
                          } else {
                            setShowSaveDialog(true)
                          }
                        }}
                        disabled={activeFilterCount === 0}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          activeFilterCount === 0
                            ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground border-border'
                            : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
                        }`}
                      >
                        <Bell className="h-3 w-3" />
                        Save &amp; Alert
                      </button>
                      {showNewCallout && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-border rounded-lg shadow-lg p-3 z-50">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <p className="font-semibold text-sm text-gray-900">Never miss a project</p>
                            <button
                              onClick={() => setShowNewCallout(false)}
                              className="text-gray-500 hover:text-gray-700 flex-shrink-0 mt-0.5"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed">
                            Set up your filters and keywords and enable email alerts to get notified when matching projects are posted.
                          </p>
                        </div>
                      )}
                    </div>
                    <span className="text-muted-foreground">|</span>
                    <button
                      onClick={() => setShowManageModal(true)}
                      className="text-primary hover:underline px-2"
                    >
                      My Searches &amp; Alerts
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
                  <Button onClick={handleSearch} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Results */}
        <div className="mt-6 border rounded-lg bg-card overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">PlanHub Projects</span>
              <span className="text-sm text-muted-foreground">| {filteredProjects.length} total</span>
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
                {unreadCount} Unread
              </button>

              {/* Date Posted filter */}
              <select
                value={datePostedFilter}
                onChange={e => { setDatePostedFilter(e.target.value as typeof datePostedFilter); setCurrentPage(1) }}
                className={`h-7 px-2 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  datePostedFilter
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                }`}
              >
                <option value="">Date Posted</option>
                <option value="today">Posted Today</option>
                <option value="last-7">Posted in Last 7 Days</option>
                <option value="last-30">Posted in Last 30 Days</option>
              </select>

              {showNewOnly && (
                <span className="text-xs text-muted-foreground">Showing {displayedProjects.length} unread</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Go to page</span>
              <input
                type="text"
                value={safePage}
                onChange={(e) => {
                  const n = parseInt(e.target.value)
                  if (!isNaN(n)) goToPage(n)
                }}
                className="w-10 h-7 text-center border rounded text-foreground"
              />
              <span>Page {safePage} of {pageCount}</span>
              <span className="flex gap-1">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="px-2 hover:text-foreground disabled:opacity-40"
                >{"<"}</button>
                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === pageCount}
                  className="px-2 hover:text-foreground disabled:opacity-40"
                >{">"}</button>
              </span>
            </div>
          </div>

          {/* Table + Side Panel */}
          <div className="flex">
            <div className="flex-1 min-w-0 overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="border-b border-border bg-muted/30">
                  <tr className="text-sm text-muted-foreground">
                    <SortableHeader label="Project" field="project-name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortableHeader label="Bid Date" field="bid-date" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <th className="text-left px-4 py-3 font-medium">Location</th>
                    <SortableHeader label="Distance" field="distance" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <th className="text-left px-4 py-3 font-medium">Est. Value</th>
                    {appliedKeywords.length > 0 && (
                      <th className="text-left px-4 py-3 font-medium">Documents</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayedProjects.length === 0 ? (
                    <tr>
                      <td colSpan={appliedKeywords.length > 0 ? 6 : 5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                        {showNewOnly ? "No unread projects. Turn off the filter to see all." : datePostedFilter ? "No projects match the selected date posted range." : "No projects match your current filters."}
                      </td>
                    </tr>
                  ) : (
                    displayedProjects.map((project) => {
                      const isNew = newProjectIds.has(project.id)
                      const isUnread = isNew && !viewedProjectIds.has(project.id)
                      const isSelected = selectedProjectId === project.id
                      const hasDocs = !!PROJECT_DOCUMENTS[project.id]
                      return (
                        <tr
                          key={project.id}
                          onClick={() => { setSelectedProjectId(isSelected ? null : project.id); markViewed(project.id) }}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary/8 border-l-2 border-l-primary"
                              : isUnread
                              ? "bg-blue-50/40 hover:bg-blue-50/70"
                              : "hover:bg-muted/30"
                          }`}
                        >
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              {isUnread && !isSelected && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" title="New — not yet viewed" />
                              )}
                              <span className={`font-medium ${isUnread && !isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                                {project.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{project.date}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{project.location}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{getCompanyDistanceLabel(project.location)}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{project.value}</td>
                          {appliedKeywords.length > 0 && (
                            <td className="px-4 py-3 text-sm">
                              {hasDocs ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setDocsModalProjectId(project.id) }}
                                  className="text-primary hover:underline font-medium"
                                >
                                  Matches Found
                                </button>
                              ) : (
                                <span className="text-muted-foreground">Available</span>
                              )}
                            </td>
                          )}
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Side Panel */}
            {selectedProjectId && (() => {
              const proj = filteredProjects.find(p => p.id === selectedProjectId)
              if (!proj) return null
              return (
                <div className="w-[360px] shrink-0 border-l bg-card overflow-y-auto" style={{ maxHeight: "600px" }}>
                  <ProjectSidePanel
                    project={proj}
                    onClose={() => setSelectedProjectId(null)}
                  />
                </div>
              )
            })()}
          </div>
        </div>

        {/* Matching Documents Modal */}
        {docsModalProjectId && (() => {
          const proj = filteredProjects.find(p => p.id === docsModalProjectId)
          const docs = PROJECT_DOCUMENTS[docsModalProjectId] ?? []
          if (!proj) return null
          return (
            <MatchingDocumentsModal
              projectName={proj.name}
              documents={docs}
              activeKeywords={appliedKeywords}
              onClose={() => setDocsModalProjectId(null)}
            />
          )
        })()}
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
