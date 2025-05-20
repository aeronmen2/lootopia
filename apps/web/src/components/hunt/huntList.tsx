// components/hunt/HuntList.tsx
import React from "react"
import { Hunt } from "@/lib/types"
import { HuntCard } from "./huntCard"

interface HuntListProps {
  hunts: Hunt[]
  title: string
  emptyMessage: string
  onJoin?: (id: string) => void
  joiningHuntId?: string | null
  renderActions?: (hunt: Hunt) => React.ReactNode
}

export function HuntList({ hunts, title, emptyMessage, onJoin, joiningHuntId, renderActions }: HuntListProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {hunts.length > 0 ? (
        <div className="grid gap-6">
          {hunts.map((hunt) => (
            <HuntCard
              key={hunt.id}
              hunt={hunt}
              onJoin={onJoin}
              joiningHuntId={joiningHuntId}
              actionSlot={renderActions?.(hunt)}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground italic">{emptyMessage}</p>
      )}
    </div>
  )
}