import React from 'react'

const Topbar = () => {
    return (
        <header className="w-full bg-white shadow p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Aether App</h1>
                <button className="text-sm text-blue-500">Logout</button>
            </div>
        </header>
    )
}

export default Topbar