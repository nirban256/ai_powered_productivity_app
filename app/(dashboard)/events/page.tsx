"use client";

import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";

const EventsPage = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div>
            <h1 className="text-4xl font-semibold">
                Events
            </h1>

            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
            />
        </div>
    )
}

export default EventsPage;