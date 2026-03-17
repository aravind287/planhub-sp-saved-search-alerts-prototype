"use client"

import { useState, KeyboardEvent } from "react"
import { X, Plus, Minus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface KeywordChipsProps {
  keywords: string[]
  onKeywordsChange: (keywords: string[]) => void
  maxKeywords?: number
}

export function KeywordChips({
  keywords,
  onKeywordsChange,
  maxKeywords = 10,
}: KeywordChipsProps) {
  const [inputValues, setInputValues] = useState<string[]>(
    keywords.length > 0 ? keywords : [""]
  )

  // Sync input values when keywords change externally
  if (keywords.length > 0 && JSON.stringify(keywords) !== JSON.stringify(inputValues.filter(v => v.trim()))) {
    // Only update if there's a real difference
    const trimmedInputs = inputValues.filter(v => v.trim())
    if (JSON.stringify(keywords) !== JSON.stringify(trimmedInputs)) {
      setInputValues(keywords.length > 0 ? [...keywords] : [""])
    }
  }

  const updateKeywords = (newInputs: string[]) => {
    setInputValues(newInputs)
    const validKeywords = newInputs
      .map(v => v.trim().toLowerCase())
      .filter(v => v !== "")
    onKeywordsChange(validKeywords)
  }

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputValues]
    newInputs[index] = value
    updateKeywords(newInputs)
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (inputValues[index].trim() && inputValues.length < maxKeywords) {
        addInput()
      }
    }
  }

  const addInput = () => {
    if (inputValues.length < maxKeywords) {
      setInputValues([...inputValues, ""])
    }
  }

  const removeInput = (index: number) => {
    if (inputValues.length > 1) {
      const newInputs = inputValues.filter((_, i) => i !== index)
      updateKeywords(newInputs)
    } else {
      // If it's the last input, just clear it
      updateKeywords([""])
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {inputValues.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-sm text-muted-foreground font-medium">OR</span>
          )}
          <div className="relative flex items-center">
            <Input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              placeholder="Enter keyword"
              className="w-[140px] pr-8 h-9"
            />
            {value && (
              <button
                type="button"
                onClick={() => removeInput(index)}
                className="absolute right-2 text-muted-foreground hover:text-foreground"
                aria-label="Remove keyword"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
      
      {/* +/- buttons */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-muted"
          onClick={() => {
            if (inputValues.length > 1) {
              removeInput(inputValues.length - 1)
            }
          }}
          disabled={inputValues.length <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="default"
          size="icon"
          className="h-8 w-8"
          onClick={addInput}
          disabled={inputValues.length >= maxKeywords}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      
    </div>
  )
}
