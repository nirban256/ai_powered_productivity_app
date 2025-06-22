import { create } from "zustand";

type Note = {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
};

type NoteStore = {
    notes: Note[];
    loading: boolean;
    summary: string | null;
    fetchNotes: () => Promise<void>;
    getNoteById: (id: string) => Promise<Note | undefined>;
    deleteNote: (id: string) => Promise<void>;
    updateNote: (note: Partial<Note> & { id: string }) => Promise<void>;
    createNote: (note: Partial<Note>) => Promise<void>;
    summarizeNote: (note: Note) => Promise<void>;
};

const useNoteStore = create<NoteStore>((set, get) => ({
    notes: [],
    loading: false,
    summary: null,

    fetchNotes: async () => {
        set({ loading: true });
        const res = await fetch("/api/notes");
        const data = await res.json();
        set({ notes: data, loading: false });
    },

    getNoteById: async (id: string) => {
        const res = await fetch(`/api/notes/${id}`);
        if (!res.ok) return undefined;
        return await res.json();
    },

    deleteNote: async (id: string) => {
        await fetch(`/api/notes/${id}`, { method: "DELETE" });
        set({ notes: get().notes.filter((n) => n.id !== id) });
    },

    updateNote: async ({ id, ...update }) => {
        await fetch(`/api/notes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(update),
        });
        const updatedNotes = get().notes.map((note) =>
            note.id === id ? { ...note, ...update } : note
        );
        set({ notes: updatedNotes });
    },

    createNote: async ({ ...update }) => {
        try {
            await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(update),
            });

            await get().fetchNotes();
        } catch (error) {
            console.error("Error creating note:", error);
        }
    },

    summarizeNote: async (note: Note) => {
        set({ loading: true });

        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-7b-instruct:free",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant that summarizes notes.",
                        },
                        {
                            role: "user",
                            content: `Summarize the following note:\n\nTitle: ${note.title}\nDescription: ${note.description}`,
                        },
                    ],
                }),
            });

            const data = await res.json();
            const summary = data.choices?.[0]?.message?.content || "No summary generated.";
            set({ summary });
        } catch (error) {
            console.error("Error summarizing note:", error);
            set({ summary: "Error generating summary." });
        }

        set({ loading: false });
    },
}));

export { useNoteStore };