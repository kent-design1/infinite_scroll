import axios from 'axios'

// Create an axios instance with your API's base URL
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor — runs before EVERY request automatically
// Grabs the token from localStorage and adds it to the header
api.interceptors.request.use((config) => {
    // Only runs in the browser (not during server side rendering)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

// Interceptor — runs after EVERY response
// If the API returns 401 (unauthorized), log the user out automatically
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api