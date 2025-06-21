"use client";

import TaskModal from '@/components/TaskModal';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import UpdateTaskModal from '@/components/UpdateTaskModal';
import WelcomeAnimation from '@/components/Welcome';
import { useUserStore } from '@/lib/store/userStore';
import { AnimatePresence, motion } from 'framer-motion';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type Task = {
    id: string;
    title: string;
    status: boolean;
    priority: string;
    createdAt: Date;
};

const TasksPage = () => {
    const user = useUserStore((s) => s.user);

    const [task, seTask] = useState<Task>();
    const [loading, setLoading] = useState(false);

    if (!user) redirect("/auth/signin");

    const getTasks = async () => {
        if (user) {
            try {
                setLoading(true);
                const tasks = await fetch("/api/tasks");
                if (!tasks.ok) (<h1 className='text-4xl font-semibold'>Failed to fetch the tasks</h1>);
                const data = await tasks.json();
                seTask(data);
                setLoading(false);
            } catch (error) {
                console.error("Getting all taks error:", error);
                setLoading(false);
            }
        }
    }

    const deleteTask = async ({ id }: { id: string }) => {
        try {
            await fetch(`/api/tasks/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            getTasks();
        } catch (error) {
            console.error("Task deletion error:", error);
        }
    }

    if (task === null) return (
        <h1 className='text-4xl font-semibold'>
            Get started by setting your first task
        </h1>
    );

    useEffect(() => {
        getTasks();
    }, [])


    return (
        <>
            <AnimatePresence mode="wait">
                {loading ? (
                    <WelcomeAnimation key="welcome" text="Getting all your tasks" />
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
                            All your tasks at one place
                        </h1>

                        <TaskModal onTaskCreated={getTasks} />

                        {Array.isArray(task) && task.map((t: any) => (
                            <Card key={t.id} className="mb-4">
                                <CardHeader>
                                    <CardTitle>{t.title}</CardTitle>
                                    <CardAction>
                                        <UpdateTaskModal onTaskCreated={getTasks} id={t.id} />
                                    </CardAction>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        {t.status ? "Completed" : "Incomplete"}
                                    </p>
                                    <p>
                                        {t.priority}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant={"outline"} onClick={() => deleteTask({ id: t.id })} className='cursor-pointer'>
                                        Delete Task
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default TasksPage