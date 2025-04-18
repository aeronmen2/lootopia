export function ErrorAlert({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
      {message}
    </div>
  )
}
