"use client";

import Spinner from '@/components/Spinner';
import { useDashboardStore } from '@/lib/store/dashboardStore';
import { useUserStore } from '@/lib/store/userStore';
import { useEffect } from 'react';
import {
    Card,
    CardAction,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeAnimation from '@/components/Welcome';

const DasboardPage = () => {
    const user = useUserStore((s) => s.user);
    const { summary, loading, fetchSummary } = useDashboardStore();

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);


    return (
        <>
            {user && (
                <AnimatePresence mode="wait">
                    {loading || !summary ? (
                        <WelcomeAnimation key="welcome" text="Welcome Back!" />
                    ) : (
                        <motion.div
                            key="dashboard"
                            className="p-4"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl font-semibold">
                                Let's get productive today {user?.name}
                            </h1>

                            <div className="pt-12">
                                {loading ? (
                                    <Spinner color="text-blue-600" size="h-8 w-8" />
                                ) : (
                                    <ul className='flex justify-between items-center'>
                                        <li>
                                            {(summary?.taskLength ?? 0) % 2 === 0 ? `${summary?.taskLength} Tasks` : `${summary?.taskLength} Task`}
                                        </li>
                                        <li>
                                            {(summary?.noteLength ?? 0) % 2 === 0 ? `${summary?.noteLength} Notes` : `${summary?.noteLength} Note`}
                                        </li>
                                        <li>
                                            {(summary?.eventLength ?? 0) % 2 === 0 ? `${summary?.eventLength} Events` : `${summary?.eventLength} Event`}
                                        </li>
                                    </ul>
                                )}
                            </div>

                            <div>
                                <h1>
                                    Most Recent Activity
                                </h1>

                                <div>
                                    {
                                        loading ? (
                                            <Spinner color="text-blue-600" size="h-8 w-8" />
                                        ) : (
                                            Array.isArray(summary?.tasks) && summary.tasks.length > 0 && (
                                                <>
                                                    {summary.tasks.map((task: any) => (
                                                        <Card key={task.id} className="mb-4">
                                                            <CardHeader>
                                                                <CardTitle>{task.title}</CardTitle>
                                                                <CardAction>{task.status ? "Completed" : "Incomplete"}</CardAction>
                                                            </CardHeader>
                                                            <CardFooter>{task.priority}</CardFooter>
                                                        </Card>
                                                    ))}
                                                </>
                                            )
                                        )
                                    }
                                </div>

                                <div>
                                    {
                                        loading ? (
                                            <Spinner color="text-blue-600" size="h-8 w-8" />
                                        ) : (
                                            Array.isArray(summary?.notes) && summary.noteLength > 0 && (
                                                <>
                                                    {summary.notes.map((note: any) => (
                                                        <Card key={note.id} className="mb-4">
                                                            <CardHeader>
                                                                <CardTitle>{note.title}</CardTitle>
                                                            </CardHeader>
                                                            <CardFooter>{note.description}</CardFooter>
                                                        </Card>
                                                    ))}
                                                </>
                                            )
                                        )
                                    }
                                </div>

                                <div>
                                    {
                                        loading ? (
                                            <Spinner color="text-blue-600" size="h-8 w-8" />
                                        ) : (
                                            Array.isArray(summary?.events) && summary.events.length > 0 && (
                                                <>
                                                    {summary.events.map((event: any) => (
                                                        <Card key={event.id} className="mb-4">
                                                            <CardHeader>
                                                                <CardTitle>{event.title}</CardTitle>
                                                            </CardHeader>
                                                            <CardFooter>{event.date}</CardFooter>
                                                        </Card>
                                                    ))}
                                                </>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </>
    )
}

export default DasboardPage;