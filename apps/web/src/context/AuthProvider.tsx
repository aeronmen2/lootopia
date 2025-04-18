const login = async (credentials: LoginCredentials) => {
  setLoading(true)
  try {
    await authApi.login(credentials) // Just perform the login
    const userData = await refreshUser() // Get and set the full user data
    return userData // Return the complete user data
  } finally {
    setLoading(false)
  }
}

const refreshUser = async () => {
  setLoading(true)
  try {
    const response = await authApi.getCurrentUser()
    setUser(response?.user)
    setIsConnected(true)
    return response?.user // Return the user data
  } catch (error) {
    setUser(null)
    setIsConnected(false)
    return null
  } finally {
    setLoading(false)
  }
}
