# Discarded Idea: Saved Search Alerts Onboarding Banner

**Status:** Discarded — replaced with contextual tooltip
**Date discarded:** 2026-03-17
**Reason:** Design feedback from Christin Leem (see Slack thread)

---

## What it was

A banner component (`components/onboarding-banner.tsx`) that appeared at the top of the Projects page to guide new users through setting up saved search alerts. It had two states:

### State 1 — Setup Guide (expanded)
- A multi-step progress banner with 3 steps: Set filters → Add keywords → Save and enable alerts
- Visual progress indicators (checkmarks when complete) and a progress bar
- CTA buttons: "Get Started" or "Save Search Alert" depending on completion state
- Collapsible to a compact pill showing "(X/3)" progress
- "How alerts work" explanation box at the bottom

### State 2 — Review Settings (thin banner)
- Appeared once the user had an active alert with global alerts enabled
- Nudged users to review ITB Notifications and Saved Keyword Alerts to reduce duplicates
- "Review Settings" button linked to `/settings/account`
- Dismissible with an X button

---

## Why it was discarded

Christin Leem flagged that the banner approach acts like a "print-out map" — it asks users to figure out where the correct settings are themselves, especially new users unfamiliar with the UI. Her recommendation:

> "It would be helpful to see the instructions next to the applicable UI elements, rather than having the user figure out where the correct settings are. Step-by-step tutorials with Pendo can help break down the info into digestible chunks & place the content at relevant points of the screen. Essentially, we're giving them a guided tour instead of handing them a print-out map. The more work we require of the users, the more friction we'll encounter."

The banner was replaced with a contextual tooltip placed directly next to the "+ Save Searches" action in the Advanced Search panel.

---

## Potential future use

- Could be revisited as a Pendo-powered guided tour that activates in-context tooltips sequentially
- The 3-step flow (Set filters → Add keywords → Save alerts) is still a valid onboarding model — just needs to be surfaced at the right UI moments rather than as a standalone banner
- The "Review Settings" thin banner (State 2) could still be useful as a one-time nudge after a user's first saved alert is created, if Pendo is not available
