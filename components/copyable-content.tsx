"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

interface CopyableContentProps {
  content: string
  className?: string
}

export function CopyableContent({ content, className }: CopyableContentProps) {
  const [, copy] = useCopyToClipboard()
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    copy(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative border rounded-md p-4 bg-background", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={handleCopy}
        aria-label="Copy to clipboard"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <div className="pr-10 whitespace-pre-wrap">{content}</div>
    </div>
  )
}

