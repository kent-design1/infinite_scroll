'use client'

import { useEffect, useState } from 'react'
import {useAuth} from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

interface Post {
    _id: string
    title: string
    body: string
    createdAt: string
    author: { name: string; email: string }
}

export default function DashboardPage() {
    const { user, logout, loading } = useAuth()
    const router = useRouter()

    const [posts, setPosts] = useState<Post[]>([])
    const [postsLoading, setPostsLoading] = useState(true)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [creating, setCreating] = useState(false)
    const [error, setError] = useState('')

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    // Fetch all posts on load
    useEffect(() => {
        if (user) fetchPosts()
    }, [user])

    const fetchPosts = async () => {
        try {
            const { data } = await api.get('/api/posts')
            setPosts(data)
        } catch (err) {
            console.error('Failed to fetch posts')
        } finally {
            setPostsLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreating(true)
        setError('')

        try {
            const { data } = await api.post('/api/posts', { title, body })
            setPosts([data, ...posts])   // add new post to top of list
            setTitle('')
            setBody('')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create post')
        } finally {
            setCreating(false)
        }
    }

    const handleDelete = async (postId: string) => {
        try {
            await api.delete(`/api/posts/${postId}`)
            setPosts(posts.filter(p => p._id !== postId))   // remove from list
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete post')
        }
    }

    if (loading) return <div className="p-8">Loading...</div>
    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Hello, {user.name}</span>
                    <button
                        onClick={logout}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="max-w-2xl mx-auto p-6 space-y-8">

                {/* Create post form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="font-medium mb-4">Create a post</h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleCreate} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <textarea
                            placeholder="Write something..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={creating}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {creating ? 'Posting...' : 'Post'}
                        </button>
                    </form>
                </div>

                {/* Posts list */}
                <div className="space-y-4">
                    <h2 className="font-medium">All posts</h2>

                    {postsLoading && (
                        <p className="text-sm text-gray-400">Loading posts...</p>
                    )}

                    {!postsLoading && posts.length === 0 && (
                        <p className="text-sm text-gray-400">No posts yet. Create one above.</p>
                    )}

                    {posts.map(post => (
                        <div key={post._id} className="bg-white rounded-lg shadow p-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{post.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1">
                                        by {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Only show delete if this user owns the post */}
                                {post.author?.email === user.email && (
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="text-xs text-red-400 hover:text-red-600"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mt-3">{post.body}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}