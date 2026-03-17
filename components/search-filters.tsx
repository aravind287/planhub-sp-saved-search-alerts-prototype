"use client"

import { Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  { value: "concrete", label: "Concrete" },
  { value: "masonry", label: "Masonry" },
  { value: "steel", label: "Steel" },
  { value: "carpentry", label: "Carpentry" },
  { value: "roofing", label: "Roofing" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "hvac", label: "HVAC" },
  { value: "flooring", label: "Flooring" },
  { value: "painting", label: "Painting" },
]

const statusOptions: FilterOption[] = [
  { value: "open", label: "Open for Bids" },
  { value: "closing-soon", label: "Closing Soon" },
  { value: "recently-posted", label: "Recently Posted" },
  { value: "awarded", label: "Awarded" },
]

const constructionTypeOptions: FilterOption[] = [
  { value: "new-construction", label: "New Construction" },
  { value: "renovation", label: "Renovation/Remodel" },
  { value: "addition", label: "Addition" },
  { value: "tenant-improvement", label: "Tenant Improvement" },
  { value: "repair", label: "Repair" },
]

const buildingUseOptions: FilterOption[] = [
  { value: "commercial", label: "Commercial" },
  { value: "residential", label: "Residential" },
  { value: "industrial", label: "Industrial" },
  { value: "institutional", label: "Institutional" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
]

const projectTypesOptions: FilterOption[] = [
  { value: "public", label: "Public Works" },
  { value: "private", label: "Private" },
  { value: "mixed", label: "Mixed Use" },
]

const laborStatusOptions: FilterOption[] = [
  { value: "union", label: "Union" },
  { value: "non-union", label: "Non-Union" },
  { value: "prevailing-wage", label: "Prevailing Wage" },
]

const regionOptions: FilterOption[] = [
  { value: "west", label: "West" },
  { value: "midwest", label: "Midwest" },
  { value: "south", label: "South" },
  { value: "northeast", label: "Northeast" },
  { value: "pacific-northwest", label: "Pacific Northwest" },
]

const countyOptions: FilterOption[] = [
  { value: "king", label: "King County" },
  { value: "pierce", label: "Pierce County" },
  { value: "snohomish", label: "Snohomish County" },
  { value: "clark", label: "Clark County" },
  { value: "spokane", label: "Spokane County" },
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

export function SearchFiltersPanel({ filters, onFiltersChange }: SearchFiltersProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-muted-foreground">Filters</div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Row 1 */}
        <MultiSelectFilter
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

        <MultiSelectFilter
          label="Regions"
          options={regionOptions}
          selected={filters.regions}
          onSelectionChange={(v) => updateFilter('regions', v)}
        />

        <MultiSelectFilter
          label="Counties"
          options={countyOptions}
          selected={filters.counties}
          onSelectionChange={(v) => updateFilter('counties', v)}
        />

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
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Bid due date
        </Button>
      </div>
    </div>
  )
}
