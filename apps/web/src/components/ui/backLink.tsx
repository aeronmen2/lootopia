// components/ui/BackLink.tsx
import { ArrowLeft } from "lucide-react"
import { Link } from "@tanstack/react-router"

interface BackLinkProps {
  to?: string
  children?: React.ReactNode
}

export function BackLink({ to = "/", children = "Retour" }: BackLinkProps) {
  return (
    <Link to={to} className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children}
    </Link>
  )
}
