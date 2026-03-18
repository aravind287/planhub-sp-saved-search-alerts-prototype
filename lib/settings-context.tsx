"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { SavedSearch } from "@/components/manage-searches-modal"
import type { FilterState } from "@/components/search-filters"

// Global notification settings
interface NotificationSettings {
  newMessages: boolean
  itbsOutsideNetwork: boolean
  estimateRequests: boolean
  savedSearchAlertsEnabled: boolean
  itbEnabled: boolean
  itbFrequency: "daily" | "instant"
  projectStatusUpdates: boolean
  bidDueDateReminders: boolean
  keywordAlertsEnabled: boolean
  legacyKeywords: string[]
}

const defaultNotificationSettings: NotificationSettings = {
  newMessages: true,
  itbsOutsideNetwork: true,
  estimateRequests: true,
  savedSearchAlertsEnabled: true,
  itbEnabled: true,
  itbFrequency: "daily",
  projectStatusUpdates: true,
  bidDueDateReminders: true,
  keywordAlertsEnabled: true,
  legacyKeywords: ["concrete", "film", "tile", "ceramic", "wood"],
}

export const emptyFilters: FilterState = {
  tradesSubtrades: [],
  status: [],
  constructionType: [],
  projectBuildingUse: [],
  projectTypes: [],
  sectorLaborStatus: [],
  regions: [],
  counties: [],
  zipCode: "",
  distance: "",
  bidDueDate: "",
}

const MAX_ALERTS = 5

interface SettingsContextType {
  // Notification settings
  notificationSettings: NotificationSettings
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => void
  
  // Saved searches
  savedSearches: SavedSearch[]
  setSavedSearches: React.Dispatch<React.SetStateAction<SavedSearch[]>>
  createSearch: (name: string, alertEnabled: boolean, alertFrequency: "daily" | "weekly" | "instant", filters: FilterState, keywords: string[]) => SavedSearch
  updateSearch: (id: string, updates: Partial<SavedSearch>) => void
  deleteSearch: (id: string) => void
  toggleAlert: (id: string, enabled: boolean) => void
  updateFrequency: (id: string, frequency: "daily" | "weekly" | "instant") => void
  
  // Computed values
  maxAlerts: number
  enabledAlertsCount: number
  canEnableMoreAlerts: boolean
  hasActiveAlert: boolean
  
  // UI state
  showOnboarding: boolean
  setShowOnboarding: (show: boolean) => void
  showReviewBanner: boolean
  setShowReviewBanner: (show: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings)
  
  // Saved searches
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  
  // UI state
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [showReviewBanner, setShowReviewBanner] = useState(true)

  const updateNotificationSettings = useCallback((updates: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...updates }))
  }, [])

  const createSearch = useCallback((
    name: string, 
    alertEnabled: boolean, 
    alertFrequency: "daily" | "weekly" | "instant",
    filters: FilterState,
    keywords: string[]
  ): SavedSearch => {
    const newSearch: SavedSearch = {
      id: crypto.randomUUID(),
      name,
      alertEnabled,
      alertFrequency,
      filters,
      keywords,
      matchCount: Math.floor(Math.random() * 200) + 10,
      lastUpdated: new Date().toISOString(),
      newCount: Math.floor(Math.random() * 8) + 3,
    }
    setSavedSearches(prev => [...prev, newSearch])
    return newSearch
  }, [])

  const updateSearch = useCallback((id: string, updates: Partial<SavedSearch>) => {
    setSavedSearches(prev =>
      prev.map(search =>
        search.id === id ? { ...search, ...updates, lastUpdated: new Date().toISOString() } : search
      )
    )
  }, [])

  const deleteSearch = useCallback((id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id))
  }, [])

  const toggleAlert = useCallback((id: string, enabled: boolean) => {
    setSavedSearches(prev =>
      prev.map(search =>
        search.id === id ? { ...search, alertEnabled: enabled } : search
      )
    )
  }, [])

  const updateFrequency = useCallback((id: string, frequency: "daily" | "weekly" | "instant") => {
    setSavedSearches(prev =>
      prev.map(search =>
        search.id === id ? { ...search, alertFrequency: frequency } : search
      )
    )
  }, [])

  // Computed values
  const enabledAlertsCount = savedSearches.filter(s => s.alertEnabled).length
  const canEnableMoreAlerts = enabledAlertsCount < MAX_ALERTS
  const hasActiveAlert = enabledAlertsCount > 0

  return (
    <SettingsContext.Provider
      value={{
        notificationSettings,
        updateNotificationSettings,
        savedSearches,
        setSavedSearches,
        createSearch,
        updateSearch,
        deleteSearch,
        toggleAlert,
        updateFrequency,
        maxAlerts: MAX_ALERTS,
        enabledAlertsCount,
        canEnableMoreAlerts,
        hasActiveAlert,
        showOnboarding,
        setShowOnboarding,
        showReviewBanner,
        setShowReviewBanner,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
