"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  search: string;
  page: number;
  tag: string;
}

export default function NotesClient({
  search: initialSearch,
  page: initialPage,
  tag,
}: NotesClientProps) {
  const [inputValue, setInputValue] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, 500);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["notes", search, page, tag],
    queryFn: () => fetchNotes(search, page, tag),
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError) {
    return <p>Could not fetch the list of notes. {error.message}</p>;
  }

  return (
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onSearch={(query) => {
            setInputValue(query);
            debouncedSearch(query);
          }}
        />

        {data && (
          <Pagination
            totalPages={data.totalPages}
            page={page}
            setPage={setPage}
          />
        )}

        <button
          className={css.button}
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          aria-label="Create a note"
        >
          Create note +
        </button>
      </div>

      {isFetching && <p>Loading, please wait...</p>}

      {data?.notes.length === 0 ? (
        <p>
          No notes found
          {search.trim() && ` for "${search.trim()}"`}.
        </p>
      ) : (
        data && <NoteList notes={data.notes} />
      )}

      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <NoteForm onCancel={() => setIsCreateModalOpen(false)} />
        </Modal>
      )}
    </main>
  );
}
