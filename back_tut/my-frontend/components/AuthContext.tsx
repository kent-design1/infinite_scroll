'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

// Shape of a user object
interface User {
    _id: string
    name: string
    email: string
}

// Shape of what the context provides to the app
interface AuthContextType {
    user: User | null
    token: string | null
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// Wrap your app in this — gives every component access to auth state
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // On first load — check if user was already logged in
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }

        setLoading(false)
    }, [])

    // Login — call API, store token, redirect
    const login = async (email: string, password: string) => {
        const { data } = await api.post('/api/auth/login', { email, password })

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email
        }))

        setToken(data.token)
        setUser({ _id: data._id, name: data.name, email: data.email })
        router.push('/dashboard')
    }

    // Register — call API, store token, redirect
    const register = async (name: string, email: string, password: string) => {
        const { data } = await api.post('/api/auth/register', { name, email, password })

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email
        }))

        setToken(data.token)
        setUser({ _id: data._id, name: data.name, email: data.email })
        router.push('/dashboard')
    }

    // Logout — wipe everything, go to login
    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook — any component can call useAuth() to get auth state
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}