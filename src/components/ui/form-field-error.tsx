import { cn } from "@/lib/utils"

interface FormFieldErrorProps {
  message?: string
  className?: string
}

export function FormFieldError({ message, className }: FormFieldErrorProps) {
  if (!message) return null

  return (
    <p className={cn("text-xs text-destructive mt-1.5", className)}>
      {message}
    </p>
  )
}
