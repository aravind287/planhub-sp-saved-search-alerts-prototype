"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ExternalLink, ChevronRight } from "lucide-react"
import { ALL_PROJECTS, type Project } from "@/lib/mock-projects"
import { useSettings } from "@/lib/settings-context"
import type { SavedSearch } from "@/components/manage-searches-modal"

// ─── Filter helpers ──────────────────────────────────────────────────────────

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
  return (new Date().getTime() - new Date(datePosted).getTime()) / (1000 * 60 * 60 * 24) <= 7
}

function getMatchingProjects(search: SavedSearch): Project[] {
  const { filters, keywords } = search
  let result = ALL_PROJECTS

  if (keywords.length > 0) {
    result = result.filter(p =>
      keywords.some(kw => {
        const q = kw.toLowerCase()
        return p.name.toLowerCase().includes(q) || p.keywords.some(pk => pk.toLowerCase().includes(q))
      })
    )
  }
  if (filters.tradesSubtrades.length > 0)
    result = result.filter(p => p.trades.some(t => filters.tradesSubtrades.includes(t)))
  if (filters.constructionType.length > 0)
    result = result.filter(p => filters.constructionType.includes(p.constructionType))
  if (filters.projectBuildingUse.length > 0)
    result = result.filter(p => filters.projectBuildingUse.includes(p.buildingUse))
  if (filters.projectTypes.length > 0)
    result = result.filter(p => filters.projectTypes.includes(p.projectType))
  if (filters.regions.length > 0)
    result = result.filter(p => filters.regions.includes(p.state))
  if (filters.counties.length > 0)
    result = result.filter(p => filters.counties.includes(`${p.state}:${p.county}`))
  if (filters.sectorLaborStatus.length > 0)
    result = result.filter(p => filters.sectorLaborStatus.includes(p.laborStatus))

  if (filters.status.length > 0) {
    const now = new Date()
    result = result.filter(p => {
      const bidDate = new Date(parseBidDate(p.date))
      return filters.status.some(s => {
        if (s === "awarded") return p.stage === "Awarded"
        if (s === "closing-soon") return p.stage === "Bidding" && bidDate <= addDays(now, 7)
        if (s === "recently-posted") return isProjectNew(p.datePosted)
        if (s === "open") return p.stage === "Bidding" || p.stage === "Pre-Bid"
        return false
      })
    })
  }

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
    result = result.filter(p => { const bid = new Date(parseBidDate(p.date)); return bid >= from && bid <= to })
  }

  // Last 7 days
  const cutoff = addDays(new Date(), -7)
  result = result.filter(p => new Date(p.datePosted) >= cutoff)
  result = [...result].sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())

  return result
}

function buildCTAUrl(search: SavedSearch): string {
  const params = new URLSearchParams()
  if (search.keywords.length > 0) params.set("keywords", search.keywords.join(","))
  if (search.filters.regions.length > 0) params.set("state", search.filters.regions.join(","))
  params.set("posted", "last-7")
  params.set("search", search.id)
  return `/?${params.toString()}`
}

// ─── Email component ─────────────────────────────────────────────────────────

function EmailPreview({ search, projects }: { search: SavedSearch; projects: Project[] }) {
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })
  const timeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  const ctaUrl = buildCTAUrl(search)
  const subject = `${projects.length} new project${projects.length !== 1 ? "s" : ""} matching "${search.name}"`

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Inbox chrome */}
      <div className="bg-white border border-gray-200 rounded-t-xl px-6 pt-5 pb-4 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-3">{subject}</h2>
        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex gap-2">
            <span className="w-12 text-right text-gray-400 flex-shrink-0">From</span>
            <span className="font-medium text-gray-700">PlanHub Alerts</span>
            <span className="text-gray-400">&lt;alerts@planhub.com&gt;</span>
          </div>
          <div className="flex gap-2">
            <span className="w-12 text-right text-gray-400 flex-shrink-0">To</span>
            <span>you@yourcompany.com</span>
          </div>
          <div className="flex gap-2">
            <span className="w-12 text-right text-gray-400 flex-shrink-0">Date</span>
            <span>{dateStr} at {timeStr}</span>
          </div>
        </div>
      </div>

      {/* Email body */}
      <div className="bg-gray-50 border-x border-b border-gray-200 rounded-b-xl overflow-hidden shadow-sm">
        {/* Brand header */}
        <div className="bg-blue-700 px-8 py-5 flex items-center justify-between">
          <span className="text-white font-bold text-2xl tracking-tight">PlanHub</span>
          <span className="text-blue-200 text-xs uppercase tracking-wide font-medium">
            {search.alertFrequency === "instant" ? "Instant" : search.alertFrequency === "daily" ? "Daily" : "Weekly"} Alert
          </span>
        </div>

        {/* Body content */}
        <div className="bg-white px-8 py-7">
          <p className="text-xl font-bold text-gray-900 mb-1">{subject}</p>
          <p className="text-sm text-gray-500 mb-6">
            New projects matching your saved search have been posted. Review them before the bid dates close.
          </p>

          {projects.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400 border border-gray-100">
              No new projects posted in the last 7 days match this search.
            </div>
          ) : (
            <div className="space-y-2 mb-7">
              {projects.slice(0, 5).map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3.5 rounded-lg border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                    <div className="flex flex-wrap items-center gap-x-2 mt-0.5 text-xs text-gray-500">
                      <span>{p.location}</span>
                      <span className="text-gray-300">|</span>
                      <span>Bid due: <strong className="text-gray-700">{p.date}</strong></span>
                      {p.value && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span>{p.value}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
                </div>
              ))}
              {projects.length > 5 && (
                <p className="text-center text-xs text-gray-400 pt-1">
                  and {projects.length - 5} more project{projects.length - 5 !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="flex justify-center pt-1">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
            >
              View all matching projects
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 text-center bg-gray-50">
          <p className="text-xs text-gray-400 leading-relaxed">
            You&rsquo;re receiving this because you set up a{" "}
            <strong className="text-gray-500">
              {search.alertFrequency === "instant" ? "instant" : search.alertFrequency === "daily" ? "daily" : "weekly"}
            </strong>{" "}
            alert for &ldquo;{search.name}&rdquo;.
            <br />
            <Link href="/settings/account" className="underline hover:text-gray-600">
              Manage your alerts
            </Link>
            {" · "}
            <span className="cursor-pointer hover:text-gray-600 underline">Unsubscribe</span>
          </p>
          <p className="text-xs text-gray-300 mt-2">PlanHub · 123 Market St, San Francisco, CA 94105</p>
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EmailPreviewPage() {
  const { savedSearches } = useSettings()
  const alertSearches = savedSearches.filter(s => s.alertEnabled)

  const emailData = useMemo(
    () => alertSearches.map(s => ({ search: s, projects: getMatchingProjects(s) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [alertSearches.map(s => s.id).join(",")]
  )

  if (alertSearches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm max-w-sm w-full">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📭</span>
          </div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">No active alerts</h2>
          <p className="text-sm text-gray-400 mb-5">
            Save a search with email alerts enabled to preview what subscribers receive.
          </p>
          <Link href="/" className="text-sm text-blue-700 font-medium hover:underline">
            ← Set up a search
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {emailData.map(({ search, projects }) => (
        <EmailPreview key={search.id} search={search} projects={projects} />
      ))}
    </div>
  )
}
