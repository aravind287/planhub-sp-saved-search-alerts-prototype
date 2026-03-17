"use client"

import { useState, KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface KeywordInputProps {
  keywords: string[]
  onKeywordsChange: (keywords: string[]) => void
  maxKeywords?: number
  placeholder?: string
}

export function KeywordInput({
  keywords,
  onKeywordsChange,
  maxKeywords = 10,
  placeholder = "Enter a keyword...",
}: KeywordInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim().toLowerCase()
    if (!trimmed) return

    if (keywords.length >= maxKeywords) {
      setError(`You can add up to ${maxKeywords} keywords per saved search.`)
      return
    }

    if (keywords.includes(trimmed)) {
      setError("This keyword already exists.")
      return
    }

    setError(null)
    onKeywordsChange([...keywords, trimmed])
    setInputValue("")
  }

  const removeKeyword = (keywordToRemove: string) => {
    onKeywordsChange(keywords.filter((k) => k !== keywordToRemove))
    setError(null)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addKeyword(inputValue)
    } else if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
      removeKeyword(keywords[keywords.length - 1])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-3 border border-border rounded-md bg-background min-h-[48px] focus-within:ring-2 focus-within:ring-ring focus-within:border-ring">
        {keywords.map((keyword) => (
          <Badge
            key={keyword}
            variant="secondary"
            className="gap-1 px-2 py-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
          >
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(keyword)}
              className="ml-0.5 hover:text-destructive focus:outline-none"
              aria-label={`Remove ${keyword}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setError(null)
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) {
              addKeyword(inputValue)
            }
          }}
          placeholder={keywords.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {keywords.length} / {maxKeywords} keywords
        </span>
        {error && <span className="text-destructive">{error}</span>}
      </div>
    </div>
  )
}
