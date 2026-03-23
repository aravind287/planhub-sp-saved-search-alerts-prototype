"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Bell, ExternalLink, ChevronRight } from "lucide-react"
import { ALL_PROJECTS, type Project } from "@/lib/mock-projects"
import { useSettings, emptyFilters } from "@/lib/settings-context"
import type { SavedSearch } from "@/components/manage-searches-modal"

// ─── Filter helpers (mirrors app/page.tsx logic) ────────────────────────────

function parseBidDate(dateStr: string): number {
  const [month, day, year] = dateStr.split("/")
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime()
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function isProjectNew(datePosted: string): boolean {
  const posted = new Date(datePosted)
  return (new Date().getTime() - posted.getTime()) / (1000 * 60 * 60 * 24) <= 7
}

/** Returns projects matching the saved search that were posted in the last 7 days,
 *  sorted newest-first. (Production would restrict to today only; demo uses 7 days
 *  so there's always content to show.) */
function getMatchingProjects(search: SavedSearch): Project[] {
  const { filters, keywords } = search
  let result = ALL_PROJECTS

  // Keywords
  if (keywords.length > 0) {
    result = result.filter(p =>
      keywords.some(kw => {
        const q = kw.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.keywords.some(pk => pk.toLowerCase().includes(q))
        )
      })
    )
  }

  // Trades
  if (filters.tradesSubtrades.length > 0) {
    result = result.filter(p =>
      p.trades.some(t => filters.tradesSubtrades.includes(t))
    )
  }

  // Construction type
  if (filters.constructionType.length > 0) {
    result = result.filter(p => filters.constructionType.includes(p.constructionType))
  }

  // Building use
  if (filters.projectBuildingUse.length > 0) {
    result = result.filter(p => filters.projectBuildingUse.includes(p.buildingUse))
  }

  // Project types
  if (filters.projectTypes.length > 0) {
    result = result.filter(p => filters.projectTypes.includes(p.projectType))
  }

  // Regions (states)
  if (filters.regions.length > 0) {
    result = result.filter(p => filters.regions.includes(p.state))
  }

  // Counties
  if (filters.counties.length > 0) {
    result = result.filter(p =>
      filters.counties.includes(`${p.state}:${p.county}`)
    )
  }

  // Status
  if (filters.status.length > 0) {
    const now = new Date()
    result = result.filter(p => {
      const bidDate = new Date(parseBidDate(p.date))
      const isClosingSoon = p.stage === "Bidding" && bidDate <= addDays(now, 7)
      const isRecentlyPosted = isProjectNew(p.datePosted)
      return filters.status.some(s => {
        if (s === "awarded") return p.stage === "Awarded"
        if (s === "closing-soon") return isClosingSoon
        if (s === "recently-posted") return isRecentlyPosted
        if (s === "open") return p.stage === "Bidding" || p.stage === "Pre-Bid"
        return false
      })
    })
  }

  // Labor status
  if (filters.sectorLaborStatus.length > 0) {
    result = result.filter(p => filters.sectorLaborStatus.includes(p.laborStatus))
  }

  // Bid due date
  if (filters.bidDueDate && filters.bidDueDate !== "custom") {
    const now = new Date()
    result = result.filter(p => {
      const bid = new Date(parseBidDate(p.date))
      switch (filters.bidDueDate) {
        case "next-7-days":  return bid >= now && bid <= addDays(now, 7)
        case "next-14-days": return bid >= now && bid <= addDays(now, 14)
        case "next-30-days": return bid >= now && bid <= addDays(now, 30)
        case "next-60-days": return bid >= now && bid <= addDays(now, 60)
        case "past-due":     return bid < now && bid >= addDays(now, -60)
        default: return true
      }
    })
  } else if (filters.bidDueDate === "custom" && filters.bidDateFrom) {
    const from = new Date(filters.bidDateFrom)
    const to = filters.bidDateTo ? new Date(filters.bidDateTo) : new Date("2099-12-31")
    result = result.filter(p => {
      const bid = new Date(parseBidDate(p.date))
      return bid >= from && bid <= to
    })
  }

  // Only projects posted in the last 7 days (production would restrict to today)
  const cutoff = addDays(new Date(), -7)
  result = result.filter(p => new Date(p.datePosted) >= cutoff)

  // Sort newest first
  result = [...result].sort(
    (a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
  )

  return result
}

function buildCTAUrl(search: SavedSearch): string {
  const params = new URLSearchParams()
  if (search.keywords.length > 0) params.set("keywords", search.keywords.join(","))
  if (search.filters.regions.length > 0) params.set("state", search.filters.regions.join(","))
  params.set("posted", "today")
  params.set("search", search.id)
  return `/?${params.toString()}`
}

// ─── Demo fallback searches (shown when no real saved searches have alerts) ──

const DEMO_SEARCHES: SavedSearch[] = [
  {
    id: "demo-1",
    name: "Security Systems – California",
    alertEnabled: true,
    alertFrequency: "daily",
    filters: { ...emptyFilters, regions: ["ca"], tradesSubtrades: ["electrical-low-voltage"] },
    keywords: ["security", "CCTV", "access control"],
    matchCount: 18,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "demo-2",
    name: "LA County Commercial Projects",
    alertEnabled: true,
    alertFrequency: "daily",
    filters: {
      ...emptyFilters,
      regions: ["ca"],
      counties: ["ca:Los Angeles"],
      constructionType: ["commercial"],
    },
    keywords: [],
    matchCount: 34,
    lastUpdated: new Date().toISOString(),
  },
]

// ─── Email mock component ────────────────────────────────────────────────────

function EmailCard({
  search,
  projects,
  isDemo,
}: {
  search: SavedSearch
  projects: Project[]
  isDemo: boolean
}) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const ctaUrl = buildCTAUrl(search)
  const frequencyLabel =
    search.alertFrequency === "instant"
      ? "Instant Alert"
      : search.alertFrequency === "daily"
      ? "Daily Alert"
      : "Weekly Alert"

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-2xl mx-auto mb-10">
      {/* Demo badge */}
      {isDemo && (
        <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-1.5 text-center">
          <span className="text-xs text-yellow-700 font-medium">
            Demo preview — save a real search with alerts to see your own data
          </span>
        </div>
      )}

      {/* Email header bar */}
      <div className="bg-blue-700 px-6 py-4 flex items-center justify-between">
        <div className="text-white font-bold text-xl tracking-tight">PlanHub</div>
        <span className="text-blue-200 text-xs">{frequencyLabel}</span>
      </div>

      {/* Email body */}
      <div className="px-6 py-6">
        <p className="text-xs text-gray-400 mb-1">{today}</p>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {projects.length} new project{projects.length !== 1 ? "s" : ""} matching &ldquo;{search.name}&rdquo;
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Here are the latest projects that match your saved search. Act fast — bid dates are approaching.
        </p>

        {/* Project list */}
        {projects.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-sm text-gray-500">
            No new projects posted in the last 7 days match this search.
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {projects.slice(0, 5).map(p => (
              <div
                key={p.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm leading-snug">{p.name}</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500">
                    <span>{p.location}</span>
                    <span>·</span>
                    <span>Bid: {p.date}</span>
                    {p.value && (
                      <>
                        <span>·</span>
                        <span>{p.value}</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 mt-0.5 flex-shrink-0" />
              </div>
            ))}
            {projects.length > 5 && (
              <p className="text-sm text-gray-500 text-center pt-1">
                +{projects.length - 5} more project{projects.length - 5 !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href={ctaUrl}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            View all matching projects
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-3">
          Opens PlanHub with &ldquo;{search.name}&rdquo; applied · Filtered to today&rsquo;s postings
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          You&rsquo;re receiving this because you enabled {frequencyLabel.toLowerCase()} for &ldquo;
          {search.name}&rdquo;.{" "}
          <span className="text-gray-500 underline cursor-pointer">Manage alerts</span>
        </p>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EmailPreviewPage() {
  const { savedSearches } = useSettings()

  const alertSearches = savedSearches.filter(s => s.alertEnabled)
  const isDemo = alertSearches.length === 0
  const searches = isDemo ? DEMO_SEARCHES : alertSearches

  const emailData = useMemo(
    () =>
      searches.map(s => ({
        search: s,
        projects: getMatchingProjects(s),
        isDemo,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searches.map(s => s.id).join(","), isDemo]
  )

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Page header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="h-5 w-5 text-blue-700" />
          <h1 className="text-lg font-bold text-gray-900">Email Alert Preview</h1>
          <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-medium">
            Demo only
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Simulates what subscribers receive. One email per saved search with alerts enabled.
          {isDemo
            ? " Showing demo data — go save a real search to preview your own."
            : " Projects shown are those posted in the last 7 days matching each search."}
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {searches.length} alert{searches.length !== 1 ? "s" : ""}{isDemo ? " (demo)" : ""}
        </span>
        <Link href="/" className="text-xs text-blue-700 hover:underline">
          ← Back to Projects
        </Link>
      </div>

      {emailData.map(({ search, projects, isDemo: demo }) => (
        <EmailCard key={search.id} search={search} projects={projects} isDemo={demo} />
      ))}
    </div>
  )
}
