"use client"

import { useState } from "react"
import Link from "next/link"
import { PlanHubHeader } from "@/components/planhub-header"
import { ChevronRight } from "lucide-react"

const menuItems = [
  { id: "company-profile", label: "Company Profile", href: "/settings/company" },
  { id: "subscription", label: "Subscription", href: "/settings/company/subscription" },
  { id: "team", label: "Team", href: "/settings/company/team" },
  { id: "company-assets", label: "Company Assets", href: "/settings/company/assets" },
  { id: "account-settings", label: "Account Settings", href: "/settings/company/account" },
]

export default function MyCompanySettingsPage() {
  const [activeMenu, setActiveMenu] = useState("account-settings")

  return (
    <div className="min-h-screen bg-background">
      <PlanHubHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-56px)] border-r border-border bg-card">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4">MENU</h2>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeMenu === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-8">Account Settings</h1>
          
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="text-center max-w-xl mx-auto">
              <p className="text-sm text-foreground mb-6">
                Looking for your Account Settings? Adjust your email notifications and account level settings on the My Account page.
              </p>
              
              <Link 
                href="/settings/account"
                className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
              >
                Go to Account Settings
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
