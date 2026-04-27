"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ExternalLink, ChevronRight, Tag } from "lucide-react"
import { ALL_PROJECTS, type Project } from "@/lib/mock-projects"
import { useSettings } from "@/lib/settings-context"
import type { SavedSearch } from "@/components/manage-searches-modal"
import type { FilterState } from "@/components/search-filters"

// ─── Demo data ───────────────────────────────────────────────────────────────

const DEMO_FILTERS: FilterState = {
  tradesSubtrades: ["electrical-low-voltage", "specialties", "special-construction", "hvac", "plumbing"],
  status: [],
  constructionType: ["commercial", "civil", "industrial"],
  projectBuildingUse: [],
  projectTypes: ["renovation-remodel-repair", "new-construction-with-site-work", "new-construction-no-site-work"],
  sectorLaborStatus: ["non-union", "prevailing-wage"],
  regions: ["ca"],
  counties: [],
  zipCode: "",
  distance: "",
  bidDueDate: "",
  bidDateFrom: "",
  bidDateTo: "",
}

const DEMO_SEARCH: SavedSearch = {
  id: "demo-preview",
  name: "California - camera",
  alertEnabled: true,
  alertFrequency: "daily",
  keywords: ["camera", "CCTV", "surveillance", "access control", "security system", "intercom", "card reader", "intrusion detection", "alarm", "network cabling"],
  filters: DEMO_FILTERS,
  matchCount: 0,
  lastUpdated: new Date().toISOString(),
}

const DEMO_FILTERS_2: FilterState = {
  tradesSubtrades: ["electrical-low-voltage", "specialties", "special-construction"],
  status: [],
  constructionType: ["commercial"],
  projectBuildingUse: [],
  projectTypes: ["renovation-remodel-repair", "new-construction-with-site-work", "new-construction-no-site-work"],
  sectorLaborStatus: ["non-union", "prevailing-wage"],
  regions: ["ca"],
  counties: [
    "ca:Santa Clara", "ca:San Diego", "ca:Alameda",
    "ca:San Francisco", "ca:Sacramento", "ca:Orange", "ca:San Mateo",
  ],
  zipCode: "",
  distance: "",
  bidDueDate: "",
  bidDateFrom: "",
  bidDateTo: "",
}

const DEMO_SEARCH_2: SavedSearch = {
  id: "demo-preview-2",
  name: "Bay Area & SoCal - Security",
  alertEnabled: true,
  alertFrequency: "daily",
  keywords: ["access control", "security camera", "CCTV", "intercom"],
  filters: DEMO_FILTERS_2,
  matchCount: 0,
  lastUpdated: new Date().toISOString(),
}

// ─── Label maps ──────────────────────────────────────────────────────────────

const TRADE_LABELS: Record<string, string> = {
  "preconstruction-planning-supervision": "Preconstruction, Planning and Supervision",
  "demolition-site-construction": "Demolition and Site Construction",
  "concrete-construction": "Concrete Construction",
  "masonry-construction": "Masonry Construction",
  "metal-steel-construction": "Metal and Steel Construction",
  "wood-carpentry-plastics": "Wood Carpentry and Plastics",
  "roofing-thermal-moisture": "Roofing, Thermal and Moisture Protection",
  "exterior-siding-masonry": "Exterior Siding and Masonry",
  "doors-glass-windows": "Doors, Glass and Windows",
  "interior-walls-ceilings-insulation": "Interior Walls, Ceilings and Insulation",
  "flooring": "Flooring",
  "painting-wallcovering": "Painting and Wallcovering",
  "kitchens-baths": "Kitchens and Baths",
  "electrical-low-voltage": "Electrical and Low Voltage",
  "hvac": "HVAC",
  "plumbing": "Plumbing",
  "fire-protection": "Fire Protection",
  "exterior-improvements-landscaping": "Exterior Improvements and Landscaping",
  "cleaning-construction-maintenance": "Cleaning and Construction Maintenance",
  "specialties": "Specialties",
  "equipment-supplies": "Equipment / Supplies",
  "decor-furnishings": "Décor and Furnishings",
  "special-construction": "Special Construction",
  "conveying-systems": "Conveying Systems",
  "other": "Other",
}

const CONSTRUCTION_TYPE_LABELS: Record<string, string> = {
  "civil": "Civil",
  "commercial": "Commercial",
  "multi-family-residential": "Multi-family Residential",
  "industrial": "Industrial",
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  "addition": "Addition",
  "demolition": "Demolition",
  "new-construction-with-site-work": "New Construction with Site Work",
  "new-construction-no-site-work": "New Construction (no Site Work)",
  "renovation-remodel-repair": "Renovation / Remodel / Repair",
  "site-work-only": "Site Work Only",
  "tenant-build-out": "Tenant Build-Out",
}

const LABOR_STATUS_LABELS: Record<string, string> = {
  "union": "Union",
  "non-union": "Non-Union",
  "prevailing-wage": "Prevailing Wage",
}

const STATUS_LABELS: Record<string, string> = {
  "open": "Open for Bids",
  "closing-soon": "Closing Soon",
  "recently-posted": "Recently Posted",
  "awarded": "Awarded",
}

const BID_DUE_LABELS: Record<string, string> = {
  "next-7-days": "Next 7 days",
  "next-14-days": "Next 14 days",
  "next-30-days": "Next 30 days",
  "next-60-days": "Next 60 days",
  "past-due": "Past due",
}

const STATE_LABELS: Record<string, string> = {
  "al": "Alabama", "ak": "Alaska", "az": "Arizona", "ar": "Arkansas",
  "ca": "California", "co": "Colorado", "ct": "Connecticut", "de": "Delaware",
  "dc": "D.C.", "fl": "Florida", "ga": "Georgia", "hi": "Hawaii",
  "id": "Idaho", "il": "Illinois", "in": "Indiana", "ia": "Iowa",
  "ks": "Kansas", "ky": "Kentucky", "la": "Louisiana", "me": "Maine",
  "md": "Maryland", "ma": "Massachusetts", "mi": "Michigan", "mn": "Minnesota",
  "ms": "Mississippi", "mo": "Missouri", "mt": "Montana", "ne": "Nebraska",
  "nv": "Nevada", "nh": "New Hampshire", "nj": "New Jersey", "nm": "New Mexico",
  "ny": "New York", "nc": "North Carolina", "nd": "North Dakota", "oh": "Ohio",
  "ok": "Oklahoma", "or": "Oregon", "pa": "Pennsylvania", "ri": "Rhode Island",
  "sc": "South Carolina", "sd": "South Dakota", "tn": "Tennessee", "tx": "Texas",
  "ut": "Utah", "vt": "Vermont", "va": "Virginia", "wa": "Washington",
  "wv": "West Virginia", "wi": "Wisconsin", "wy": "Wyoming",
}

// ─── Filter helpers ───────────────────────────────────────────────────────────

function parseBidDate(dateStr: string): number {
  const [month, day, year] = dateStr.split("/")
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime()
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

// Returns up to 20 projects matching the saved search filters (keywords are annotation only, not a filter)
function getMatchingProjects(search: SavedSearch): { projects: Project[]; totalCount: number } {
  const { filters } = search
  let result = ALL_PROJECTS

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
        if (s === "recently-posted") return (new Date().getTime() - new Date(p.datePosted).getTime()) / (1000 * 60 * 60 * 24) <= 7
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
    result = result.filter(p => {
      const bid = new Date(parseBidDate(p.date))
      return bid >= from && bid <= to
    })
  }

  result = [...result].sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())
  return { projects: result.slice(0, 20), totalCount: result.length }
}

// Returns which saved-search keywords matched this specific project
function getMatchingKeywords(project: Project, searchKeywords: string[]): string[] {
  return searchKeywords.filter(kw => {
    const q = kw.toLowerCase()
    return project.name.toLowerCase().includes(q) || project.keywords.some(pk => pk.toLowerCase().includes(q))
  })
}

function buildCTAUrl(search: SavedSearch): string {
  const params = new URLSearchParams()
  params.set("search", search.id)
  params.set("posted", "last-7")
  return `/?${params.toString()}`
}

// ─── Search context block ─────────────────────────────────────────────────────

function chips(values: string[], labelMap: Record<string, string>, max: number) {
  const shown = values.slice(0, max).map(v => labelMap[v] ?? v)
  const more = values.length - max
  return { shown, more: Math.max(0, more) }
}

function FilterRow({ label, values, labelMap, max = 2 }: {
  label: string
  values: string[]
  labelMap: Record<string, string>
  max?: number
}) {
  if (values.length === 0) return null
  const { shown, more } = chips(values, labelMap, max)
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-gray-500 w-[88px] flex-shrink-0">{label}</span>
      <div className="flex flex-wrap items-center gap-1">
        {shown.map(v => (
          <span key={v} className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs border border-gray-200">
            {v}
          </span>
        ))}
        {more > 0 && <span className="text-xs text-gray-400">+{more} more</span>}
      </div>
    </div>
  )
}

function SearchContextBlock({ search }: { search: SavedSearch }) {
  const { filters, keywords } = search

  const activeFilterNames: string[] = [
    ...(filters.regions.length > 0 || (filters.zipCode && filters.distance) ? ["Location"] : []),
    ...(filters.tradesSubtrades.length > 0 ? ["Trades & Subtrades"] : []),
    ...(filters.constructionType.length > 0 ? ["Construction Type"] : []),
    ...(filters.projectBuildingUse.length > 0 ? ["Building Use"] : []),
    ...(filters.projectTypes.length > 0 ? ["Project Type"] : []),
    ...(filters.sectorLaborStatus.length > 0 ? ["Labor Status"] : []),
    ...(filters.status.length > 0 ? ["Status"] : []),
    ...(filters.bidDueDate ? ["Bid Due Date"] : []),
  ]

  const MAX_KW = 5
  const shownKw = keywords.slice(0, MAX_KW)
  const moreKw = Math.max(0, keywords.length - MAX_KW)

  if (keywords.length === 0 && activeFilterNames.length === 0) return null

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6 space-y-2">
      {activeFilterNames.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400 mr-1">Filters:</span>
          {activeFilterNames.map(name => (
            <span key={name} className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-gray-300 text-gray-600 text-xs">
              {name}
            </span>
          ))}
        </div>
      )}
      {shownKw.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400 mr-1">Keywords:</span>
          {shownKw.map(kw => (
            <span key={kw} className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
              {kw}
            </span>
          ))}
          {moreKw > 0 && <span className="text-xs text-gray-400">+{moreKw} more</span>}
        </div>
      )}
    </div>
  )
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, searchKeywords }: { project: Project; searchKeywords: string[] }) {
  const matchedKw = getMatchingKeywords(project, searchKeywords)
  const MAX_SHOWN = 3
  const shownKw = matchedKw.slice(0, MAX_SHOWN)
  const moreKw = matchedKw.length - MAX_SHOWN

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-lg border border-gray-100 bg-gray-50 hover:bg-green-50 hover:border-green-200 transition-colors">
      <div className="flex-1 min-w-0">
        <Link
          href={`/?project=${project.id}`}
          className="font-semibold text-green-700 hover:underline text-sm leading-snug"
        >
          {project.name}
        </Link>
        <div className="flex flex-wrap items-center gap-x-2 mt-0.5 text-xs text-gray-500">
          <span>{project.location}</span>
          <span className="text-gray-300">|</span>
          <span>Bid due: <strong className="text-gray-700">{project.date}</strong></span>
        </div>
        {shownKw.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-2">
            <Tag className="h-3 w-3 text-green-600 flex-shrink-0" />
            {shownKw.map(kw => (
              <span key={kw} className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[11px] font-medium">
                {kw}
              </span>
            ))}
            {moreKw > 0 && <span className="text-[11px] text-gray-400">+{moreKw} more</span>}
          </div>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 mt-0.5" />
    </div>
  )
}

// ─── Email component ──────────────────────────────────────────────────────────

function EmailPreview({ search, projects, totalCount, isDemo }: { search: SavedSearch; projects: Project[]; totalCount: number; isDemo?: boolean }) {
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })
  const timeStr = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  const ctaUrl = buildCTAUrl(search)
  const subject = `${totalCount} new project${totalCount !== 1 ? "s" : ""} matching "${search.name}"`
  const freqLabel = search.alertFrequency === "instant" ? "Instant" : search.alertFrequency === "daily" ? "Daily" : "Weekly"

  return (
    <div className="max-w-2xl mx-auto mb-10">
      {/* Inbox chrome */}
      <div className="bg-white border border-gray-200 rounded-t-xl px-6 pt-5 pb-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-base font-semibold text-gray-900">{subject}</h2>
          {isDemo && (
            <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-0.5">
              Demo Preview
            </span>
          )}
        </div>
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
        <div className="bg-green-700 px-8 py-5 flex items-center justify-between">
          <span className="text-white font-bold text-2xl tracking-tight">PlanHub</span>
          <span className="text-green-200 text-xs uppercase tracking-wide font-medium">{freqLabel} Alert</span>
        </div>

        {/* Body */}
        <div className="bg-white px-8 py-7">
          <p className="text-base text-gray-800 mb-6">
            Hi John,<br />
            here are <strong>{projects.length < totalCount ? `${projects.length} of ${totalCount}` : totalCount} new projects</strong> matching your saved search <strong>&ldquo;{search.name}&rdquo;</strong>. Review them before the bid dates close.
          </p>

          <SearchContextBlock search={search} />

          {projects.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400 border border-gray-100">
              No new projects posted in the last 7 days match this search.
            </div>
          ) : (
            <>
              {totalCount > 20 && (
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">
                    Showing <strong className="text-gray-700">20 of {totalCount}</strong> matching projects
                  </p>
                  <Link href={ctaUrl} className="text-sm text-green-700 font-medium hover:underline">
                    View all {totalCount} →
                  </Link>
                </div>
              )}
              <div className="space-y-2 mb-7">
                {projects.map(p => (
                  <ProjectCard key={p.id} project={p} searchKeywords={search.keywords} />
                ))}
              </div>
            </>
          )}

          {/* CTA */}
          <div className="flex justify-center pt-1">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
            >
              View all {totalCount} matching projects
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 text-center bg-gray-50">
          <p className="text-xs text-gray-400 leading-relaxed">
            You&rsquo;re receiving this because you set up a{" "}
            <strong className="text-gray-500">{freqLabel.toLowerCase()}</strong>{" "}
            alert for &ldquo;{search.name}&rdquo;.
            <br />
            <Link href="/settings/account" className="underline hover:text-gray-600">
              Manage Saved Searches &amp; Alerts
            </Link>
            {" · "}
            <Link href="/settings/account" className="underline hover:text-gray-600">
              Notification Settings
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmailPreviewPage() {
  const { savedSearches } = useSettings()
  const alertSearches = savedSearches.filter(s => s.alertEnabled)

  const emailData = useMemo(() => {
    const demo1 = getMatchingProjects(DEMO_SEARCH)
    const demo2 = getMatchingProjects(DEMO_SEARCH_2)
    const demoEntries = [
      { search: DEMO_SEARCH, projects: demo1.projects, totalCount: demo1.totalCount, isDemo: true },
      { search: DEMO_SEARCH_2, projects: demo2.projects, totalCount: demo2.totalCount, isDemo: true },
    ]
    const realEntries = alertSearches.map(s => {
      const { projects, totalCount } = getMatchingProjects(s)
      return { search: s, projects, totalCount, isDemo: false }
    })
    return [...demoEntries, ...realEntries]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertSearches.map(s => s.id).join(",")])

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {emailData.map(({ search, projects, totalCount, isDemo }) => (
        <EmailPreview key={search.id} search={search} projects={projects} totalCount={totalCount} isDemo={isDemo} />
      ))}
    </div>
  )
}
