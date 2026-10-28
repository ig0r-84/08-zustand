import axios from "axios";

import type { Note, NoteTag } from "@/types/note";

const noteApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  search: string,
  page: number,
  tag: string,
): Promise<NotesHttpResponse> => {
  const response = await noteApi.get<NotesHttpResponse>("/notes", {
    params: {
      search,
      perPage: 12,
      page,
      ...(tag !== "all" && { tag }),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await noteApi.get<Note>(`/notes/${id}`);

  return response.data;
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await noteApi.post<Note>("/notes", noteData);

  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await noteApi.delete<Note>(`/notes/${noteId}`);

  return response.data;
};
