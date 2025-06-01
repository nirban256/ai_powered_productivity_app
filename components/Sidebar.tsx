import React from 'react'

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-100 h-full p-4">
            <nav className="space-y-4">
                <a href="/dashboard">🏠 Dashboard</a>
                <a href="/tasks">📝 Tasks</a>
                <a href="/notes">📒 Notes</a>
            </nav>
        </aside>
    )
}

export default Sidebar