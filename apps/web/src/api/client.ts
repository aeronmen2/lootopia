import Cookies from "js-cookie"

const API_URL = "http://localhost:3000"

const getCsrfToken = () => {
  return Cookies.get("XSRF-TOKEN") || ""
}

async function api(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    "x-csrf-token": getCsrfToken(),
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`,
      )
    }

    console.log("API response:", response)

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

export { api }
