"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface MobileNavProps {
  children: React.ReactNode
  className?: string
}

export function MobileNav({ children, className }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("lg:hidden", className)}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            {children}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
