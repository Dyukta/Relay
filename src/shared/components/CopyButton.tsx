"use client"

import { useState } from "react"
import { cn } from "@/shared/utils/cn"

interface CopyButtonProps {
  value: string
  className?: string
}

export const CopyButton = ({ value, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "text-xs px-2 py-1 rounded border transition-colors",
        copied
          ? "border-green-500/30 text-green-400 bg-green-500/10"
          : "border-[#2a2a2a] text-[#666] hover:text-white hover:border-[#444] bg-transparent",
        className
      )}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  )
}