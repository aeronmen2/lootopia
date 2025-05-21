import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexComponent,
})

function DashboardIndexComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Overview</h2>
          <p>Welcome to your dashboard! This is your main overview page.</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
          <ul className="list-disc pl-5">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="flex flex-col space-y-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Action 1
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Action 2
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
