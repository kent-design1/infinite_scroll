'use client'

import { useState, useEffect } from 'react'

export default function PlaygroundPage() {

    // ─── ALL YOUR STATES ───────────────────────────────────────

    const [name, setName] = useState('')               // text input
    const [age, setAge] = useState('')                 // number input
    const [isHappy, setIsHappy] = useState(false)      // checkbox
    const [count, setCount] = useState(0)              // counter
    const [items, setItems] = useState<string[]>([])   // list
    const [newItem, setNewItem] = useState('')         // text for new item
    const [loading, setLoading] = useState(false)      // loading state
    const [joke, setJoke] = useState('')               // fetched data
    const [error, setError] = useState('')             // error message
    const [selected, setSelected] = useState('')       // dropdown
    const [charCount, setCharCount] = useState(0)      // character counter
    const [search, setSearch] = useState('')           // search filter
    const [darkMode, setDarkMode] = useState(false)    // toggle theme

    // ─── USEEFFECT 1 ───────────────────────────────────────────
    // Runs once when the page loads
    useEffect(() => {
        console.log('Page loaded!')
        document.title = 'Playground'
    }, [])

    // ─── USEEFFECT 2 ───────────────────────────────────────────
    // Runs every time "name" changes
    useEffect(() => {
        if (name) {
            console.log(`Name changed to: ${name}`)
        }
    }, [name])

    // ─── USEEFFECT 3 ───────────────────────────────────────────
    // Runs every time count changes
    useEffect(() => {
        document.title = `Count is ${count}`
    }, [count])

    // ─── FUNCTIONS ─────────────────────────────────────────────

    // Add item to list
    const addItem = () => {
        if (!newItem) return                          // do nothing if empty
        setItems([...items, newItem])                 // add to list
        setNewItem('')                                // clear input
    }

    // Remove item from list
    const removeItem = (itemToRemove: string) => {
        setItems(items.filter(item => item !== itemToRemove))
    }

    // Fetch a joke from a real API
    const fetchJoke = async () => {
        setLoading(true)
        setError('')
        setJoke('')

        try {
            const res = await fetch('https://official-joke-api.appspot.com/random_joke')
            const data = await res.json()
            setJoke(`${data.setup} ... ${data.punchline}`)
        } catch (err) {
            setError('Failed to fetch joke')
        } finally {
            setLoading(false)
        }
    }

    // Filter items by search
    const filteredItems = items.filter(item =>
        item.toLowerCase().includes(search.toLowerCase())
    )

    // ─── JSX ───────────────────────────────────────────────────

    return (
        <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-2xl mx-auto space-y-10">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">React Playground</h1>
                    {/* TOGGLE — darkMode flips between true and false */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="text-sm border px-3 py-1 rounded"
                    >
                        {darkMode ? 'Light mode' : 'Dark mode'}
                    </button>
                </div>

                {/* ── SECTION 1: Basic inputs ── */}
                <section className="space-y-3">
                    <h2 className="font-medium text-lg border-b pb-1">1. Basic inputs</h2>

                    {/* Text input */}
                    <div>
                        <label className="text-sm block mb-1">Your name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Type your name..."
                            className="border rounded px-3 py-2 text-sm w-full text-gray-900"
                        />
                        {/* Only shows when name is not empty */}
                        {name && <p className="text-sm mt-1 text-blue-500">Hello, {name}!</p>}
                    </div>

                    {/* Number input */}
                    <div>
                        <label className="text-sm block mb-1">Your age</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Type your age..."
                            className="border rounded px-3 py-2 text-sm w-full text-gray-900"
                        />
                        {age && Number(age) >= 18
                            ? <p className="text-sm mt-1 text-green-500">You are an adult</p>
                            : age && <p className="text-sm mt-1 text-red-500">You are a minor</p>
                        }
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isHappy}
                            onChange={(e) => setIsHappy(e.target.checked)}
                            id="happy"
                        />
                        <label htmlFor="happy" className="text-sm">
                            Are you happy? {isHappy ? '😊' : '😐'}
                        </label>
                    </div>

                    {/* Dropdown */}
                    <div>
                        <label className="text-sm block mb-1">Favourite language</label>
                        <select
                            value={selected}
                            onChange={(e) => setSelected(e.target.value)}
                            className="border rounded px-3 py-2 text-sm w-full text-gray-900"
                        >
                            <option value="">-- pick one --</option>
                            <option value="typescript">TypeScript</option>
                            <option value="python">Python</option>
                            <option value="rust">Rust</option>
                        </select>
                        {selected && <p className="text-sm mt-1">You picked: {selected}</p>}
                    </div>
                </section>

                {/* ── SECTION 2: Counter ── */}
                <section className="space-y-3">
                    <h2 className="font-medium text-lg border-b pb-1">2. Counter</h2>
                    <p className="text-sm text-gray-500">Watch the browser tab title change too</p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setCount(count - 1)}
                            className="bg-red-500 text-white px-4 py-2 rounded text-sm"
                        >
                            -1
                        </button>

                        <span className="text-2xl font-bold w-12 text-center">{count}</span>

                        <button
                            onClick={() => setCount(count + 1)}
                            className="bg-green-500 text-white px-4 py-2 rounded text-sm"
                        >
                            +1
                        </button>

                        <button
                            onClick={() => setCount(0)}
                            className="border px-4 py-2 rounded text-sm"
                        >
                            Reset
                        </button>
                    </div>

                    {count > 10 && <p className="text-sm text-orange-500">Getting high!</p>}
                    {count < 0 && <p className="text-sm text-red-500">Gone negative!</p>}
                    {count === 0 && <p className="text-sm text-gray-400">Zero.</p>}
                </section>

                {/* ── SECTION 3: List with add/remove/search ── */}
                <section className="space-y-3">
                    <h2 className="font-medium text-lg border-b pb-1">3. List — add, remove, search</h2>

                    {/* Add item */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addItem()} // add on Enter key
                            placeholder="Add an item..."
                            className="border rounded px-3 py-2 text-sm flex-1 text-gray-900"
                        />
                        <button
                            onClick={addItem}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                        >
                            Add
                        </button>
                    </div>

                    {/* Search — only shows if there are items */}
                    {items.length > 0 && (
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search items..."
                            className="border rounded px-3 py-2 text-sm w-full text-gray-900"
                        />
                    )}

                    {/* Item count */}
                    <p className="text-xs text-gray-400">
                        {items.length} items total · {filteredItems.length} shown
                    </p>

                    {/* The list */}
                    <ul className="space-y-2">
                        {filteredItems.map((item, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center bg-white border rounded px-3 py-2 text-sm text-gray-900"
                            >
                                <span>{item}</span>
                                <button
                                    onClick={() => removeItem(item)}
                                    className="text-red-400 hover:text-red-600 text-xs"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Empty state */}
                    {items.length === 0 && (
                        <p className="text-sm text-gray-400">No items yet. Add one above.</p>
                    )}
                </section>

                {/* ── SECTION 4: Character counter textarea ── */}
                <section className="space-y-3">
                    <h2 className="font-medium text-lg border-b pb-1">4. Character counter</h2>

                    <textarea
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                            setCharCount(e.target.value.length)
                        }}
                        placeholder="Type anything..."
                        className="border rounded px-3 py-2 text-sm w-full h-24 resize-none text-gray-900"
                    />

                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{charCount} characters</span>
                        {charCount > 100
                            ? <span className="text-red-500">Too long!</span>
                            : <span className="text-green-500">Good length</span>
                        }
                    </div>
                </section>

                {/* ── SECTION 5: Fetch from real API ── */}
                <section className="space-y-3">
                    <h2 className="font-medium text-lg border-b pb-1">5. Fetch from a real API</h2>
                    <p className="text-xs text-gray-400">Hits a real joke API — watch the loading state</p>

                    <button
                        onClick={fetchJoke}
                        disabled={loading}
                        className="bg-purple-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                    >
                        {loading ? 'Fetching...' : 'Get a joke'}
                    </button>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {joke && (
                        <div className="bg-white border rounded p-4 text-sm text-gray-800">
                            {joke}
                        </div>
                    )}
                </section>

            </div>
        </div>
    )
}