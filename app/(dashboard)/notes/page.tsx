"use client";

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomeAnimation from '@/components/Welcome';
import { useUserStore } from '@/lib/store/userStore';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NoteModal from '@/components/NoteModal';
import UpdateNoteModal from '@/components/UpdateNoteModal';
import { useNoteStore } from '@/lib/store/noteStore';

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
    ssr: false,
});

const NotesPage = () => {
    const user = useUserStore((s) => s.user);

    const { notes, loading, fetchNotes, deleteNote } = useNoteStore();

    if (!user) redirect("/auth/signin");

    useEffect(() => {
        fetchNotes();
    }, [])


    return (
        <>
            <AnimatePresence mode="wait">
                {loading ? (
                    <WelcomeAnimation key="welcome" text="Getting all your notes" />
                ) : (
                    <motion.div
                        key="dashboard"
                        className="p-4"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {Array.isArray(notes) && notes.length > 0 ? (
                            <h1 className="text-4xl font-semibold">
                                All your notes at one place
                            </h1>
                        ) : (
                            <h1 className='text-4xl font-semibold'>
                                Get started by writing your first note
                            </h1>
                        )}

                        <NoteModal onTaskCreated={fetchNotes} />

                        <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
                            {Array.isArray(notes) && notes.map((n: any) => (
                                <Card key={n.id} className="mb-4 w-full max-w-full overflow-hidden break-words">
                                    <CardHeader>
                                        <CardTitle className='text-lg sm:text-xl truncate'>{n.title}</CardTitle>
                                        <CardAction>
                                            <UpdateNoteModal onTaskCreated={fetchNotes} id={n.id} />
                                        </CardAction>
                                    </CardHeader>
                                    <CardContent>
                                        <MarkdownPreview source={n.description} className="text-sm sm:text-base" />
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant={"outline"} onClick={() => deleteNote(n.id)} className='cursor-pointer'>
                                            Delete Note
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default NotesPage;