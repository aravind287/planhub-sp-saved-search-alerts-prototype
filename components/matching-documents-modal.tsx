"use client"

import { X, FileText, FileSpreadsheet, FilePlus, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProjectDocument } from "@/lib/mock-documents"

const TYPE_ICONS: Record<string, React.ReactNode> = {
  "Specifications": <FileText className="h-4 w-4 text-blue-500" />,
  "Plans":          <FileSpreadsheet className="h-4 w-4 text-violet-500" />,
  "Addendum":       <FilePlus className="h-4 w-4 text-amber-500" />,
  "Contract":       <FileCheck className="h-4 w-4 text-green-500" />,
  "RFI":            <FileText className="h-4 w-4 text-rose-500" />,
}

interface MatchingDocumentsModalProps {
  projectName: string
  documents: ProjectDocument[]
  activeKeywords: string[]
  onClose: () => void
}

export function MatchingDocumentsModal({ projectName, documents, activeKeywords, onClose }: MatchingDocumentsModalProps) {
  // Only show documents that contain at least one active keyword match
  const relevant = activeKeywords.length > 0
    ? documents.filter(doc =>
        doc.matchedKeywords.some(mk =>
          activeKeywords.some(ak => mk.toLowerCase().includes(ak.toLowerCase()) || ak.toLowerCase().includes(mk.toLowerCase()))
        )
      )
    : documents

  const totalMatches = relevant.reduce((sum, d) => sum + d.matchedKeywords.length, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b">
          <div>
            <h2 className="font-semibold text-sm text-foreground">View Matching Results</h2>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{projectName}</p>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Summary */}
        <div className="px-5 py-2.5 bg-primary/5 border-b text-xs text-primary font-medium">
          {relevant.length} document{relevant.length !== 1 ? "s" : ""} with {totalMatches} keyword match{totalMatches !== 1 ? "es" : ""} found
          {activeKeywords.length > 0 && (
            <span className="text-muted-foreground font-normal ml-1">
              for: {activeKeywords.map(k => `"${k}"`).join(", ")}
            </span>
          )}
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto divide-y">
          {relevant.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">No matching documents found.</p>
          ) : (
            relevant.map((doc) => (
              <div key={doc.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0">{TYPE_ICONS[doc.type] ?? <FileText className="h-4 w-4" />}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground leading-snug">{doc.name}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{doc.pages} pp.</span>
                    </div>
                    <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground mt-1">
                      {doc.type}
                    </span>

                    {/* Matched keywords */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {doc.matchedKeywords.map(kw => (
                        <span key={kw} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {kw}
                        </span>
                      ))}
                    </div>

                    {/* Matching sections */}
                    <div className="mt-2 space-y-1">
                      {doc.matchSections.map(section => (
                        <div key={section} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                          {section}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t flex justify-end">
          <Button size="sm" className="text-xs h-7">View All Documents</Button>
        </div>
      </div>
    </div>
  )
}
