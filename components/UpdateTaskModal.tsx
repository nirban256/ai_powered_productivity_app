"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type UpdateTaskModalProps = {
    onTaskCreated: () => void;
    id: string;
};

type Task = {
    id: string;
    title: string;
    status: boolean;
    priority: string;
    createdAt: Date;
};

const UpdateTaskModal = ({ onTaskCreated, id }: UpdateTaskModalProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("low");
    const [status, setStatus] = useState("Incomplete");
    const [task, setTask] = useState<Task>();

    const getTaskById = async ({ id }: { id: string }) => {
        try {
            const tasks = await fetch(`/api/tasks/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!tasks.ok) (<h1 className='text-4xl font-semibold'>Failed to fetch the task</h1>);
            const data = await tasks.json();
            setTask(data);
        } catch (error) {
            console.error("Getting task by id error:", error);
        }
    }

    const updateTask = async ({ id }: { id: string }) => {
        await fetch(`/api/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title,
                priority,
                status: status === "Incomplete" ? false : true,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        setOpen(false);
        setTitle("");
        setPriority("low");
        onTaskCreated();
    };

    useEffect(() => {
        getTaskById({ id })
    }, [open]);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setPriority(task.priority);
            setStatus(task.status ? "Complete" : "Incomplete");
        }
    }, [task])



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mt-4 cursor-pointer">Update Task</Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-200">
                <DialogHeader>
                    <DialogTitle>Update the task</DialogTitle>
                    <DialogDescription>Enter task details below</DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <select
                    className="border p-2 rounded-md"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="severe">Severe</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                </select>

                <select
                    className="border p-2 rounded-md"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Incomplete">Incomplete</option>
                    <option value="Complete">Complete</option>
                </select>

                <Button onClick={() => updateTask({ id })} disabled={!title} className="cursor-pointer">
                    Update Task
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateTaskModal;