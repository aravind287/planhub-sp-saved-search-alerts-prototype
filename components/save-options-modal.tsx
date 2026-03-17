"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SaveOptionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
  onSaveAsNew: () => void
  searchName: string
}

export function SaveOptionsModal({
  open,
  onOpenChange,
  onSave,
  onSaveAsNew,
  searchName,
}: SaveOptionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Saved Searches</DialogTitle>
          <DialogDescription>
            Would you like to save your changes or save as new search?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-start gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave()
              onOpenChange(false)
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              onSaveAsNew()
              onOpenChange(false)
            }}
          >
            Save as New
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
