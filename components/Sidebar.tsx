import { Home, LayoutList, NotebookTabs, Sparkles, CalendarClockIcon } from 'lucide-react'
import React from 'react'

const Sidebar = () => {
    const menu = [
        {
            "display": "Dashboard",
            "url": "/",
            "icon": Home
        },
        {
            "display": "Tasks",
            "url": "/tasks",
            "icon": LayoutList
        },
        {
            "display": "Notes",
            "url": "/notes",
            "icon": NotebookTabs
        },
        {
            "display": "Events",
            "url": "/events",
            "icon": CalendarClockIcon
        },
        {
            "display": "AI Suggestion",
            "url": "/suggestions",
            "icon": Sparkles
        },
    ];

    return (
        <aside className="w-64">
            <nav>
                <ul className="space-y-4 flex flex-col justify-between">
                    {menu.map((m) => (
                        <li key={m.url} className="flex items-center p-3">
                            <a href={m.url} className='px-1 flex justify-between items-center gap-x-1.5'>
                                <m.icon className="w-5 h-5" />
                                {m.display}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar