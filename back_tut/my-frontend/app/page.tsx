import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-semibold">My App</h1>
                <p className="text-gray-500">A full stack Next.js + Express application</p>
                <div className="flex gap-4 justify-center pt-2">
                    <Link
                        href="/login"
                        className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="border border-blue-600 text-blue-600 px-6 py-2 rounded text-sm font-medium hover:bg-blue-50"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    )
}