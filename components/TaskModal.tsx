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
import { useState } from "react";

type TaskModalProps = {
    onTaskCreated: () => void;
};

const TaskModal = ({ onTaskCreated }: TaskModalProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("low");

    const createTask = async () => {
        await fetch("/api/tasks", {
            method: "POST",
            body: JSON.stringify({
                title,
                priority,
                status: false,
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mt-4 cursor-pointer">+ New Task</Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-200">
                <DialogHeader>
                    <DialogTitle>Create a new task</DialogTitle>
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

                <Button onClick={createTask} disabled={!title} className="cursor-pointer">
                    Create
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default TaskModal;