"use client"

import { useState } from "react"
import { CalendarIcon, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DateRange } from "react-day-picker"
import { COUNTIES_BY_STATE } from "@/lib/counties-data"

export interface FilterState {
  tradesSubtrades: string[]
  status: string[]
  constructionType: string[]
  projectBuildingUse: string[]
  projectTypes: string[]
  sectorLaborStatus: string[]
  regions: string[]
  counties: string[]
  zipCode: string
  distance: string
  bidDueDate: string
  bidDateFrom: string
  bidDateTo: string
}

interface SearchFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

interface FilterOption {
  value: string
  label: string
}

const tradesOptions: FilterOption[] = [
  { value: "preconstruction-planning-supervision", label: "Preconstruction, Planning and Supervision" },
  { value: "demolition-site-construction", label: "Demolition and Site Construction" },
  { value: "concrete-construction", label: "Concrete Construction" },
  { value: "masonry-construction", label: "Masonry Construction" },
  { value: "metal-steel-construction", label: "Metal and Steel Construction" },
  { value: "wood-carpentry-plastics", label: "Wood Carpentry and Plastics Construction" },
  { value: "roofing-thermal-moisture", label: "Roofing, Thermal and Moisture Protection" },
  { value: "exterior-siding-masonry", label: "Exterior Siding and Masonry" },
  { value: "doors-glass-windows", label: "Doors, Glass and Windows" },
  { value: "interior-walls-ceilings-insulation", label: "Interior Walls, Ceilings and Insulation" },
  { value: "flooring", label: "Flooring" },
  { value: "painting-wallcovering", label: "Painting and Wallcovering" },
  { value: "kitchens-baths", label: "Kitchens and Baths" },
  { value: "electrical-low-voltage", label: "Electrical and Low Voltage" },
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "fire-protection", label: "Fire Protection" },
  { value: "exterior-improvements-landscaping", label: "Exterior Improvements and Landscaping" },
  { value: "cleaning-construction-maintenance", label: "Cleaning and Construction Maintenance" },
  { value: "specialties", label: "Specialties" },
  { value: "equipment-supplies", label: "Equipment / Supplies" },
  { value: "decor-furnishings", label: "Décor and Furnishings" },
  { value: "special-construction", label: "Special Construction" },
  { value: "conveying-systems", label: "Conveying Systems" },
  { value: "other", label: "Other" },
]

const statusOptions: FilterOption[] = [
  { value: "open", label: "Open for Bids" },
  { value: "closing-soon", label: "Closing Soon" },
  { value: "recently-posted", label: "Recently Posted" },
  { value: "awarded", label: "Awarded" },
]

const constructionTypeOptions: FilterOption[] = [
  { value: "civil", label: "Civil" },
  { value: "commercial", label: "Commercial" },
  { value: "multi-family-residential", label: "Multi-family Residential" },
  { value: "industrial", label: "Industrial" },
]

const buildingUseOptions: FilterOption[] = [
  { value: "arena-stadium", label: "Arena/Stadium" },
  { value: "assisted-living", label: "Assisted Living Facility/Elder Care" },
  { value: "auto-dealership", label: "Auto Dealership" },
  { value: "bank-financial", label: "Bank/Financial" },
  { value: "bridges-tunnels", label: "Bridges/Tunnels" },
  { value: "bus-station", label: "Bus Station" },
  { value: "canal", label: "Canal" },
  { value: "casino", label: "Casino" },
  { value: "clinic-hospital-medical", label: "Clinic/Hospital/Medical" },
  { value: "clubhouse", label: "Clubhouse" },
  { value: "community-center", label: "Community Center" },
  { value: "conference-convention-center", label: "Conference/Convention Center" },
  { value: "convenience-store-gas-station", label: "Convenience Store/Gas Station" },
  { value: "day-care-center", label: "Day Care Center" },
  { value: "docks-marina", label: "Docks/Marina" },
  { value: "educational-school-university", label: "Educational/School/University" },
  { value: "fire-police-station", label: "Fire/Police Station" },
  { value: "fitness-center", label: "Fitness Center" },
  { value: "golf-course", label: "Golf Course" },
  { value: "grocery-store", label: "Grocery Store" },
  { value: "hotel-motel", label: "Hotel/Motel" },
  { value: "jail-prison", label: "Jail/Prison" },
  { value: "laboratory", label: "Laboratory" },
  { value: "library", label: "Library" },
  { value: "lift-station", label: "Lift Station" },
  { value: "manufacturing-plant", label: "Manufacturing Plant" },
  { value: "medical", label: "Medical" },
  { value: "military", label: "Military" },
  { value: "mixed-use", label: "Mixed-Use" },
  { value: "multi-residential", label: "Multi-Residential" },
  { value: "municipal", label: "Municipal" },
  { value: "museum", label: "Museum" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
  { value: "park-playground", label: "Park/Playground" },
  { value: "parking-garage", label: "Parking Garage" },
  { value: "pipeline", label: "Pipeline" },
  { value: "power-plants", label: "Power Plants" },
  { value: "private-school", label: "Private School" },
  { value: "pump-station", label: "Pump Station" },
  { value: "recreation-center", label: "Recreation Center" },
  { value: "refinery", label: "Refinery" },
  { value: "religious-funeral", label: "Religious/Funeral" },
  { value: "residential-subdivision", label: "Residential Subdivision" },
  { value: "restaurant", label: "Restaurant" },
  { value: "retail-store", label: "Retail Store" },
  { value: "road-highway", label: "Road/Highway" },
  { value: "salon", label: "Salon" },
  { value: "seawall", label: "Seawall" },
  { value: "service-station-car-wash", label: "Service Station/Car Wash" },
  { value: "shell-building", label: "Shell Building" },
  { value: "shopping-center", label: "Shopping Center" },
  { value: "sidewalk-parking-lot", label: "Sidewalk/Parking Lot" },
  { value: "single-family-residential", label: "Single Family Residential" },
  { value: "solar-wind-farm", label: "Solar Wind Farm" },
  { value: "solid-waste-station", label: "Solid Waste Station" },
  { value: "storage-facility", label: "Storage Facility" },
  { value: "swimming-pool", label: "Swimming Pool" },
  { value: "theater-auditorium", label: "Theater/Auditorium" },
  { value: "towers-cellular-tv-radio", label: "Towers-Cellular/TV/Radio/Water/Other" },
  { value: "train-station", label: "Train Station" },
  { value: "transportation-terminal", label: "Transportation Terminal" },
  { value: "warehouse-distribution", label: "Warehouse/Distribution" },
  { value: "waste-water-treatment", label: "Waste Water Treatment" },
  { value: "water-sewer", label: "Water/Sewer" },
]

const projectTypesOptions: FilterOption[] = [
  { value: "addition", label: "Addition" },
  { value: "demolition", label: "Demolition" },
  { value: "new-construction-with-site-work", label: "New Construction with Site Work" },
  { value: "new-construction-no-site-work", label: "New Construction no Site Work" },
  { value: "renovation-remodel-repair", label: "Renovation/Remodel/Repair" },
  { value: "site-work-only", label: "Site Work Only" },
  { value: "tenant-build-out", label: "Tenant Build-Out" },
]

const laborStatusOptions: FilterOption[] = [
  { value: "union", label: "Union" },
  { value: "non-union", label: "Non-Union" },
  { value: "prevailing-wage", label: "Prevailing Wage" },
]

const regionOptions: FilterOption[] = [
  { value: "al", label: "Alabama" },
  { value: "ak", label: "Alaska" },
  { value: "az", label: "Arizona" },
  { value: "ar", label: "Arkansas" },
  { value: "ca", label: "California" },
  { value: "co", label: "Colorado" },
  { value: "ct", label: "Connecticut" },
  { value: "de", label: "Delaware" },
  { value: "dc", label: "District of Columbia" },
  { value: "fl", label: "Florida" },
  { value: "ga", label: "Georgia" },
  { value: "hi", label: "Hawaii" },
  { value: "id", label: "Idaho" },
  { value: "il", label: "Illinois" },
  { value: "in", label: "Indiana" },
  { value: "ia", label: "Iowa" },
  { value: "ks", label: "Kansas" },
  { value: "ky", label: "Kentucky" },
  { value: "la", label: "Louisiana" },
  { value: "me", label: "Maine" },
  { value: "md", label: "Maryland" },
  { value: "ma", label: "Massachusetts" },
  { value: "mi", label: "Michigan" },
  { value: "mn", label: "Minnesota" },
  { value: "ms", label: "Mississippi" },
  { value: "mo", label: "Missouri" },
  { value: "mt", label: "Montana" },
  { value: "ne", label: "Nebraska" },
  { value: "nv", label: "Nevada" },
  { value: "nh", label: "New Hampshire" },
  { value: "nj", label: "New Jersey" },
  { value: "nm", label: "New Mexico" },
  { value: "ny", label: "New York" },
  { value: "nc", label: "North Carolina" },
  { value: "nd", label: "North Dakota" },
  { value: "oh", label: "Ohio" },
  { value: "ok", label: "Oklahoma" },
  { value: "or", label: "Oregon" },
  { value: "pa", label: "Pennsylvania" },
  { value: "ri", label: "Rhode Island" },
  { value: "sc", label: "South Carolina" },
  { value: "sd", label: "South Dakota" },
  { value: "tn", label: "Tennessee" },
  { value: "tx", label: "Texas" },
  { value: "ut", label: "Utah" },
  { value: "vt", label: "Vermont" },
  { value: "va", label: "Virginia" },
  { value: "wa", label: "Washington" },
  { value: "wv", label: "West Virginia" },
  { value: "wi", label: "Wisconsin" },
  { value: "wy", label: "Wyoming" },
]


const distanceOptions: FilterOption[] = [
  { value: "25", label: "Within 25 miles" },
  { value: "50", label: "Within 50 miles" },
  { value: "100", label: "Within 100 miles" },
  { value: "250", label: "Within 250 miles" },
]

interface MultiSelectFilterProps {
  label: string
  options: FilterOption[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
}

function MultiSelectFilter({ label, options, selected, onSelectionChange }: MultiSelectFilterProps) {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onSelectionChange(selected.filter(v => v !== value))
    } else {
      onSelectionChange([...selected, value])
    }
  }

  const displayLabel = selected.length > 0 
    ? `${label} (${selected.length})` 
    : label

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`w-full justify-between font-normal ${selected.length > 0 ? 'border-primary/50 bg-primary/5' : ''}`}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto" align="start">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={() => toggleOption(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SearchableMultiSelectFilter({ label, options, selected, onSelectionChange }: MultiSelectFilterProps) {
  const [query, setQuery] = useState("")

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onSelectionChange(selected.filter(v => v !== value))
    } else {
      onSelectionChange([...selected, value])
    }
  }

  const filtered = query.trim()
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  const displayLabel = selected.length > 0 ? `${label} (${selected.length})` : label

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) setQuery("") }}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between font-normal ${selected.length > 0 ? 'border-primary/50 bg-primary/5' : ''}`}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0" align="start">
        <div className="flex items-center border-b px-3 py-2 gap-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder={`Search ${label.toLowerCase()}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <div className="max-h-60 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">No results</p>
          ) : (
            filtered.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selected.includes(option.value)}
                onCheckedChange={() => toggleOption(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const BID_PRESETS = [
  { value: "next-7-days", label: "Next 7 Days" },
  { value: "next-14-days", label: "Next 14 Days" },
  { value: "next-30-days", label: "Next 30 Days" },
  { value: "next-60-days", label: "Next 60 Days" },
  { value: "past-due", label: "Past Due (within 60 days)" },
]

interface BidDateFilterProps {
  bidDueDate: string
  bidDateFrom: string
  bidDateTo: string
  onChange: (bidDueDate: string, bidDateFrom: string, bidDateTo: string) => void
}

function BidDateFilter({ bidDueDate, bidDateFrom, bidDateTo, onChange }: BidDateFilterProps) {
  const [range, setRange] = useState<DateRange | undefined>(
    bidDateFrom ? { from: new Date(bidDateFrom), to: bidDateTo ? new Date(bidDateTo) : undefined } : undefined
  )

  const activePreset = BID_PRESETS.find(p => p.value === bidDueDate)

  let buttonLabel = "Bid due date"
  if (activePreset) {
    buttonLabel = activePreset.label
  } else if (bidDateFrom) {
    const from = new Date(bidDateFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const to = bidDateTo ? new Date(bidDateTo).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "..."
    buttonLabel = `${from} – ${to}`
  }

  const isActive = !!bidDueDate || !!bidDateFrom

  const handlePreset = (value: string) => {
    setRange(undefined)
    onChange(value === bidDueDate ? "" : value, "", "")
  }

  const handleRangeChange = (r: DateRange | undefined) => {
    setRange(r)
    onChange("custom", r?.from?.toISOString() ?? "", r?.to?.toISOString() ?? "")
  }

  const handleClear = () => {
    setRange(undefined)
    onChange("", "", "")
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`gap-2 font-normal ${isActive ? "border-primary/50 bg-primary/5" : ""}`}
        >
          <CalendarIcon className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Tabs defaultValue={bidDueDate === "custom" || bidDateFrom ? "custom" : "preset"}>
          <div className="flex items-center justify-between px-3 pt-3 pb-1">
            <TabsList className="h-8">
              <TabsTrigger value="preset" className="text-xs px-3">Preset</TabsTrigger>
              <TabsTrigger value="custom" className="text-xs px-3">Custom</TabsTrigger>
            </TabsList>
            {isActive && (
              <button onClick={handleClear} className="text-xs text-muted-foreground hover:text-foreground">
                Clear
              </button>
            )}
          </div>
          <TabsContent value="preset" className="p-3 pt-2 w-56">
            <div className="grid grid-cols-2 gap-1.5">
              {BID_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePreset(preset.value)}
                  className={`text-xs rounded-md px-2 py-1.5 text-left border transition-colors
                    ${bidDueDate === preset.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-input hover:bg-accent"
                    }
                    ${preset.value === "past-due" ? "col-span-2" : ""}
                  `}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="custom" className="p-3 pt-2">
            <Calendar
              mode="range"
              selected={range}
              onSelect={handleRangeChange}
              numberOfMonths={1}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

export function SearchFiltersPanel({ filters, onFiltersChange }: SearchFiltersProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-muted-foreground">Filters</div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Row 1 */}
        <SearchableMultiSelectFilter
          label="Trades"
          options={tradesOptions}
          selected={filters.tradesSubtrades}
          onSelectionChange={(v) => updateFilter('tradesSubtrades', v)}
        />

        <MultiSelectFilter
          label="Status"
          options={statusOptions}
          selected={filters.status}
          onSelectionChange={(v) => updateFilter('status', v)}
        />

        <MultiSelectFilter
          label="Construction Type"
          options={constructionTypeOptions}
          selected={filters.constructionType}
          onSelectionChange={(v) => updateFilter('constructionType', v)}
        />

        <MultiSelectFilter
          label="Building Use"
          options={buildingUseOptions}
          selected={filters.projectBuildingUse}
          onSelectionChange={(v) => updateFilter('projectBuildingUse', v)}
        />

        <MultiSelectFilter
          label="Project Types"
          options={projectTypesOptions}
          selected={filters.projectTypes}
          onSelectionChange={(v) => updateFilter('projectTypes', v)}
        />

        {/* Row 2 */}
        <MultiSelectFilter
          label="Labor Status"
          options={laborStatusOptions}
          selected={filters.sectorLaborStatus}
          onSelectionChange={(v) => updateFilter('sectorLaborStatus', v)}
        />

        <SearchableMultiSelectFilter
          label="Regions"
          options={regionOptions}
          selected={filters.regions}
          onSelectionChange={(v) => updateFilter('regions', v)}
        />

        {(() => {
          const countyOptions: FilterOption[] = filters.regions.flatMap(state =>
            (COUNTIES_BY_STATE[state] ?? []).map(name => ({
              value: `${state}:${name}`,
              label: name,
            }))
          )
          if (filters.regions.length === 0) {
            return (
              <Button variant="outline" className="w-full justify-between font-normal opacity-50 cursor-not-allowed" disabled>
                <span className="truncate">Counties</span>
                <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
              </Button>
            )
          }
          return (
            <SearchableMultiSelectFilter
              label="Counties"
              options={countyOptions}
              selected={filters.counties}
              onSelectionChange={(v) => updateFilter('counties', v)}
            />
          )
        })()}

        <Input
          placeholder="Zip code"
          value={filters.zipCode}
          onChange={(e) => updateFilter("zipCode", e.target.value)}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-normal">
              <span>{filters.distance ? distanceOptions.find(d => d.value === filters.distance)?.label : "Distance"}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {distanceOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={filters.distance === option.value}
                onCheckedChange={() => updateFilter("distance", filters.distance === option.value ? "" : option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bid Due Date */}
      <div className="flex items-center gap-3">
        <BidDateFilter
          bidDueDate={filters.bidDueDate}
          bidDateFrom={filters.bidDateFrom}
          bidDateTo={filters.bidDateTo}
          onChange={(bidDueDate, bidDateFrom, bidDateTo) =>
            onFiltersChange({ ...filters, bidDueDate, bidDateFrom, bidDateTo })
          }
        />
      </div>
    </div>
  )
}
