"use client"

import Link from "next/link"
import { ChevronDown, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function PlanHubHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="flex h-14 items-center px-4 gap-4 overflow-hidden">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              <div className="h-5 w-1.5 bg-primary rounded-sm" />
              <div className="h-5 w-1.5 bg-primary rounded-sm" />
              <div className="h-5 w-1.5 bg-primary/60 rounded-sm" />
            </div>
            <span className="text-lg font-semibold text-foreground ml-1">planHub</span>
          </div>
        </Link>

        {/* Main Nav */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none min-w-0 flex-1">
          <Link 
            href="/" 
            className="px-3 py-2 text-sm font-medium text-primary border-b-2 border-primary"
          >
            Projects
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                Lead Finder <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Find Leads</DropdownMenuItem>
              <DropdownMenuItem>My Leads</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/takeoff" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            Takeoff + Estimation
          </Link>
          <Link href="/bid-planner" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            Bid Planner
          </Link>
          <Link href="/my-bids" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            My Bids
          </Link>
          <Link href="/directory" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            Directory
          </Link>
          <Link href="/messages" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground relative">
            Messages
            <span className="absolute -top-0.5 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">3</span>
          </Link>
          <Link href="/my-company" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            My Company
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button variant="outline" size="sm" className="text-xs">
            Nationwide
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-destructive text-destructive-foreground text-[9px] rounded-full flex items-center justify-center">5</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
