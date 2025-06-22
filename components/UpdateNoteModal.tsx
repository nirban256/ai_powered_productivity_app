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
import dynamic from "next/dynamic";
import { useNoteStore } from "@/lib/store/noteStore";
import { Loader2 } from "lucide-react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type UpdateNoteModalProps = {
    onTaskCreated: () => void;
    id: string;
};

const UpdateNoteModal = ({ onTaskCreated, id }: UpdateNoteModalProps) => {
    const { loading, getNoteById, updateNote } = useNoteStore();

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchNote = async () => {
            if (open) {
                const note = await getNoteById(id);
                if (note) {
                    setTitle(note.title);
                    setDescription(note.description);
                }
            }
        };

        fetchNote();
    }, [open, id, getNoteById]);

    const handleUpdate = () => {
        updateNote({
            id,
            title,
            description,
        });
        onTaskCreated();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mt-4 cursor-pointer">Update Note</Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-200">
                <DialogHeader>
                    <DialogTitle>Update the note</DialogTitle>
                    <DialogDescription>Enter the note details below</DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="w-full">
                    <label className="text-sm text-gray-700 mb-1 block">Description (Markdown Supported)</label>
                    <div data-color-mode="light">
                        <MDEditor
                            value={description}
                            onChange={(val) => setDescription(val || "")}
                            height={200}
                            preview="edit"
                        />
                    </div>
                </div>

                <Button
                    onClick={() => handleUpdate()}
                    disabled={!title || loading}
                    className="cursor-pointer flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        "Update Note"
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateNoteModal;