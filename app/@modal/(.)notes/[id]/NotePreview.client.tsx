"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "../../../notes/[id]/NoteDetails.module.css";

export default function NotePreview() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading, please wait...</p>}

      {(isError || (!isLoading && !note)) && <p>Something went wrong.</p>}

      {note && (
        <main className={css.main}>
          <div className={css.container}>
            <div className={css.item}>
              <div className={css.header}>
                <h2>{note.title}</h2>
              </div>

              <p className={css.tag}>{note.tag}</p>
              <p className={css.content}>{note.content}</p>

              <p className={css.date}>
                Created{" "}
                <time dateTime={note.createdAt}>
                  {new Date(note.createdAt).toLocaleString()}
                </time>
              </p>
            </div>
          </div>
        </main>
      )}
    </Modal>
  );
}
