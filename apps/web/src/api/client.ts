const API_URL = "http://localhost:3000"

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

async function api(endpoint: string, options: RequestInit = {}, retry = true) {
  const url = `${API_URL}${endpoint}`;

  // Only set Content-Type if not sending FormData
  const headers = isFormData(options.body)
    ? { ...options.headers }
    : { "Content-Type": "application/json", ...options.headers };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 401 && retry) {
      // Attempt to refresh session
      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (refreshResponse.ok) {
        const retryResponse = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Request failed with status ${retryResponse.status}`,
          );
        }
        // Only parse as JSON if response is JSON
        const ct = retryResponse.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          return await retryResponse.json();
        } else {
          return await retryResponse.text();
        }
      } else {
        throw new Error("Session refresh failed");
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`,
      );
    }

    // Only parse as JSON if response is JSON
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export { api }
