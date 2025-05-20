import { Separator } from "@/components/ui/separator"

export function OrDivider() {
  return (
    <div className="relative my-2">
      <Separator />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-white px-2 text-sm text-gray-500">or</span>
      </div>
    </div>
  )
}
