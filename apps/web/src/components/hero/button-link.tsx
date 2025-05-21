import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ButtonLinkProps {
  href: string
  children: ReactNode
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
  className?: string
}

const ButtonLink = ({
  href,
  children,
  variant = "default",
  className,
}: ButtonLinkProps) => {
  return (
    <a href={href}>
      <Button variant={variant} className={cn(className)}>
        {children}
      </Button>
    </a>
  )
}

export default ButtonLink
