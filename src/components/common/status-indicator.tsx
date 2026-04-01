import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "paid" | "unpaid"

interface StatusIndicatorProps {
  status: Status
  className?: string
  size?: "default" | "sm" | "lg"
}

const statusConfig: Record<Status, { 
  label: string
  variant: "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline"
}> = {
  pending: { 
    label: "Aguardando", 
    variant: "warning" 
  },
  confirmed: { 
    label: "Confirmado", 
    variant: "info" 
  },
  in_progress: { 
    label: "Em andamento", 
    variant: "default" 
  },
  completed: { 
    label: "Concluído", 
    variant: "success" 
  },
  cancelled: { 
    label: "Cancelado", 
    variant: "destructive" 
  },
  paid: { 
    label: "Pago", 
    variant: "success" 
  },
  unpaid: { 
    label: "Pendente", 
    variant: "warning" 
  },
}

export function StatusIndicator({ status, className, size = "default" }: StatusIndicatorProps) {
  const config = statusConfig[status]
  
  if (!config) {
    return null
  }

  return (
    <Badge 
      variant={config.variant} 
      size={size}
      className={cn("font-medium", className)}
    >
      {config.label}
    </Badge>
  )
}
