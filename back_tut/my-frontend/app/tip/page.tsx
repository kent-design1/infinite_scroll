"use client"

import {useState} from "react";

interface Todo {
    id: number
    text: string
    done: boolean
}



const TodoList = () => {



    const [selected, setSelected] = useState('')
    const [newItem, setNewItem] = useState('')
    const [todos, setTodos] = useState<Todo[]>([])


    const addTodo = () => {
        if (!newItem) return
        setTodos([...todos, {
            id: Date.now(),   // unique id using timestamp
            text: newItem,
            done: false       // starts as not done
        }])
        setNewItem('')
    }

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
        ))
    }

        return (
            <section className="min-h-screen mx-auto px-8 bg-gray-400 py-4">
                <div className="flex flex-wrap items-center justify-between px-8 space-y-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome to Todo with useState
                    </h1>

                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTodo()} // add on Enter key
                                placeholder="Add an item..."
                                className="border rounded px-3 py-2 text-sm flex-1 text-gray-900"
                            />
                            <button
                                onClick={addTodo}
                                className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                            >
                                Add
                            </button>

                            <div>
                                {todos.length === 0
                                    ? <p className="text-sm text-gray-600">No todos yet. Add one above.</p>
                                    : <p className="text-sm text-gray-700">{todos.length} completed</p>
                                }

                                {todos.map(todo => (
                                    <div key={todo.id}>
                                        <p>{todo.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                </div>
            </section>

        )
}

export default TodoList