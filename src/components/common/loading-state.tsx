import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  variant?: "full-page" | "section" | "inline"
  text?: string
  className?: string
}

export function LoadingState({ 
  variant = "section", 
  text = "Carregando...",
  className 
}: LoadingStateProps) {
  if (variant === "full-page") {
    return (
      <div className={cn("fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50", className)}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
      </div>
    )
  }

  if (variant === "section") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    )
  }

  // inline variant
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}
