import type { Metadata } from "next";

import CreateNote from "./CreateNote";

export const metadata: Metadata = {
  title: "Create note | NoteHub",
  description: "Create a new note and save your ideas in NoteHub.",
  openGraph: {
    title: "Create note | NoteHub",
    description: "Create a new note and save your ideas in NoteHub.",
    url: "https://notehub.com/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub application for managing personal notes",
      },
    ],
  },
};

export default function CreateNotePage() {
  return <CreateNote />;
}
