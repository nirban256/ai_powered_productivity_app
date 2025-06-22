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
import dynamic from "next/dynamic";
import { useNoteStore } from "@/lib/store/noteStore";
import { Loader2 } from "lucide-react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type NoteModalProps = {
    onTaskCreated: () => void;
};

const NoteModal = ({ onTaskCreated }: NoteModalProps) => {
    const { loading, createNote } = useNoteStore();

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const createNotes = () => {
        createNote({
            title,
            description
        })
        onTaskCreated();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mt-4 cursor-pointer">+ New Note</Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-200 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create a new note</DialogTitle>
                    <DialogDescription>Enter note details below</DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="Note title"
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
                    onClick={createNotes}
                    disabled={!title || loading}
                    className="cursor-pointer flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create Note"
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default NoteModal;