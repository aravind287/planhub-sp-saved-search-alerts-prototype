"use client"

import { X, Heart, ThumbsDown, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/mock-projects"

const TRADE_LABELS: Record<string, string> = {
  "preconstruction-planning-supervision": "Preconstruction, Planning and Supervision",
  "demolition-site-construction": "Demolition and Site Construction",
  "concrete-construction": "Concrete Construction",
  "masonry-construction": "Masonry Construction",
  "metal-steel-construction": "Metal and Steel Construction",
  "wood-carpentry-plastics": "Wood Carpentry and Plastics Construction",
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

const BUILDING_USE_LABELS: Record<string, string> = {
  "arena-stadium": "Arena/Stadium",
  "assisted-living": "Assisted Living Facility/Elder Care",
  "auto-dealership": "Auto Dealership",
  "bank-financial": "Bank/Financial",
  "bridges-tunnels": "Bridges/Tunnels",
  "bus-station": "Bus Station",
  "canal": "Canal",
  "casino": "Casino",
  "clinic-hospital-medical": "Clinic/Hospital/Medical",
  "clubhouse": "Clubhouse",
  "community-center": "Community Center",
  "conference-convention-center": "Conference/Convention Center",
  "convenience-store-gas-station": "Convenience Store/Gas Station",
  "day-care-center": "Day Care Center",
  "docks-marina": "Docks/Marina",
  "educational-school-university": "Educational/School/University",
  "fire-police-station": "Fire/Police Station",
  "fitness-center": "Fitness Center",
  "golf-course": "Golf Course",
  "grocery-store": "Grocery Store",
  "hotel-motel": "Hotel/Motel",
  "jail-prison": "Jail/Prison",
  "laboratory": "Laboratory",
  "library": "Library",
  "lift-station": "Lift Station",
  "manufacturing-plant": "Manufacturing Plant",
  "medical": "Medical",
  "military": "Military",
  "mixed-use": "Mixed-Use",
  "multi-residential": "Multi-Residential",
  "municipal": "Municipal",
  "museum": "Museum",
  "office": "Office",
  "other": "Other",
  "park-playground": "Park/Playground",
  "parking-garage": "Parking Garage",
  "pipeline": "Pipeline",
  "power-plants": "Power Plants",
  "private-school": "Private School",
  "pump-station": "Pump Station",
  "recreation-center": "Recreation Center",
  "refinery": "Refinery",
  "religious-funeral": "Religious/Funeral",
  "residential-subdivision": "Residential Subdivision",
  "restaurant": "Restaurant",
  "retail-store": "Retail Store",
  "road-highway": "Road/Highway",
  "salon": "Salon",
  "seawall": "Seawall",
  "service-station-car-wash": "Service Station/Car Wash",
  "shell-building": "Shell Building",
  "shopping-center": "Shopping Center",
  "sidewalk-parking-lot": "Sidewalk/Parking Lot",
  "single-family-residential": "Single Family Residential",
  "solar-wind-farm": "Solar Wind Farm",
  "solid-waste-station": "Solid Waste Station",
  "storage-facility": "Storage Facility",
  "swimming-pool": "Swimming Pool",
  "theater-auditorium": "Theater/Auditorium",
  "towers-cellular-tv-radio": "Towers-Cellular/TV/Radio/Water/Other",
  "train-station": "Train Station",
  "transportation-terminal": "Transportation Terminal",
  "warehouse-distribution": "Warehouse/Distribution",
  "waste-water-treatment": "Waste Water Treatment",
  "water-sewer": "Water/Sewer",
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
  "new-construction-no-site-work": "New Construction no Site Work",
  "renovation-remodel-repair": "Renovation/Remodel/Repair",
  "site-work-only": "Site Work Only",
  "tenant-build-out": "Tenant Build-Out",
}

function generateDescription(project: Project): string {
  const buildingUse = BUILDING_USE_LABELS[project.buildingUse] ?? project.buildingUse
  const projectType = PROJECT_TYPE_LABELS[project.projectType] ?? project.projectType
  const tradeList = project.trades.slice(0, 2).map(t => TRADE_LABELS[t] ?? t).join(" and ")
  return `This project calls for the ${projectType} of an existing ${buildingUse} facility. Work includes ${tradeList} and related scope. Located in ${project.location}.`
}

interface ProjectSidePanelProps {
  project: Project
  onClose: () => void
}

export function ProjectSidePanel({ project, onClose }: ProjectSidePanelProps) {
  const [showAllTrades, setShowAllTrades] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notInterested, setNotInterested] = useState(false)

  const tradeLabels = project.trades.map(t => TRADE_LABELS[t] ?? t)
  const visibleTrades = showAllTrades ? tradeLabels : tradeLabels.slice(0, 4)
  const hasMoreTrades = tradeLabels.length > 4

  const stageLabel =
    project.stage === "Bidding" ? "GC and Sub Bidding" :
    project.stage === "Pre-Bid" ? "Pre-Bidding" :
    project.stage

  // Derive estimated start ~6 weeks after bid date
  const [m, d, y] = project.date.split("/")
  const bidDateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
  bidDateObj.setDate(bidDateObj.getDate() + 42)
  const estimatedStart = bidDateObj.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })

  const infoRows = [
    { label: "Construction Type", value: CONSTRUCTION_TYPE_LABELS[project.constructionType] ?? project.constructionType },
    { label: "Project Type", value: PROJECT_TYPE_LABELS[project.projectType] ?? project.projectType },
    { label: "Project Building Use", value: BUILDING_USE_LABELS[project.buildingUse] ?? project.buildingUse },
    { label: "Estimated Start Date", value: estimatedStart },
    { label: "Estimated Completion Date", value: "—" },
    { label: "Project Value", value: project.value },
    { label: "Status", value: stageLabel },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-4 border-b">
        <div>
          <h3 className="font-semibold text-sm text-foreground leading-snug">
            {project.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{project.location}</p>
        </div>
        <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground shrink-0 mt-0.5">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {generateDescription(project)}
        </p>

        {/* View Project Details button */}
        <Button className="w-full bg-primary text-primary-foreground gap-2 h-8 text-xs">
          <ExternalLink className="h-3.5 w-3.5" />
          View Project Details
        </Button>

        {/* Matching Trades */}
        {tradeLabels.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Matching Trades</p>
            <div className="flex flex-wrap gap-1.5">
              {visibleTrades.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-primary/10 text-primary border border-primary/20"
                >
                  {label}
                </span>
              ))}
            </div>
            {hasMoreTrades && (
              <button
                onClick={() => setShowAllTrades(!showAllTrades)}
                className="mt-1.5 text-xs text-primary hover:underline flex items-center gap-1"
              >
                {showAllTrades ? (
                  <><ChevronUp className="h-3 w-3" />Show Less</>
                ) : (
                  <><ChevronDown className="h-3 w-3" />Show More ({tradeLabels.length - 4} more)</>
                )}
              </button>
            )}
          </div>
        )}

        {/* Basic Information */}
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Basic Information</p>
          <div className="space-y-1.5">
            {infoRows.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-2 text-xs">
                <span className="text-muted-foreground shrink-0">{label}</span>
                <span className="text-foreground text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="border-t p-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`flex-1 gap-1.5 text-xs h-8 ${saved ? "border-primary text-primary bg-primary/5" : ""}`}
          onClick={() => setSaved(!saved)}
        >
          <Heart className={`h-3.5 w-3.5 ${saved ? "fill-primary" : ""}`} />
          {saved ? "Saved" : "Save"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`flex-1 gap-1.5 text-xs h-8 ${notInterested ? "border-destructive text-destructive bg-destructive/5" : ""}`}
          onClick={() => setNotInterested(!notInterested)}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          Not Interested
        </Button>
      </div>
    </div>
  )
}
