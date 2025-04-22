const API_URL = "http://localhost:3000"

async function api(endpoint: string, options: RequestInit = {}, retry = true) {
  const url = `${API_URL}${endpoint}`

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    })

    if (response.status === 401 && retry) {
      // Attempt to refresh session
      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      if (refreshResponse.ok) {
        const retryResponse = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        })
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}))
          throw new Error(
            errorData.message ||
              `Request failed with status ${retryResponse.status}`,
          )
        }
        return await retryResponse.json()
      } else {
        throw new Error("Session refresh failed")
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`,
      )
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

export { api }
