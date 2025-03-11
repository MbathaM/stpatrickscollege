"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea, type TextareaProps } from "@/components/ui/textarea"

interface CharacterCountTextareaProps extends Omit<TextareaProps, "maxLength"> {
  maxLength?: number
  showCount?: boolean
}

const CharacterCountTextarea = React.forwardRef<HTMLTextAreaElement, CharacterCountTextareaProps>(
  ({ className, maxLength = 400, showCount = true, onChange, ...props }, ref) => {
    const [count, setCount] = React.useState(0)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value

      if (maxLength && value.length <= maxLength) {
        setCount(value.length)
        onChange?.(e)
      } else if (maxLength && value.length > maxLength) {
        e.target.value = value.slice(0, maxLength)
        setCount(maxLength)
      }
    }

    return (
      <div className="relative">
        <Textarea
          ref={ref}
          className={cn("pr-16 pb-8", className)}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        {showCount && (
          <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            {count}/{maxLength} Characters
          </div>
        )}
      </div>
    )
  },
)

CharacterCountTextarea.displayName = "CharacterCountTextarea"

export { CharacterCountTextarea }

