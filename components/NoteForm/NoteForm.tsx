"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel?: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
  }>({});

  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: async () => {
      clearDraft();

      await queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.push("/notes/filter/all");
    },
  });

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const values: NoteFormValues = {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? ""),
      tag: String(formData.get("tag") ?? "Todo") as NoteTag,
    };

    const newErrors: {
      title?: string;
      content?: string;
    } = {};

    if (values.title.length < 3) {
      newErrors.title = "Заголовок має містити щонайменше 3 символи";
    } else if (values.title.length > 50) {
      newErrors.title = "Заголовок має містити не більше 50 символів";
    }

    if (values.content.length > 500) {
      newErrors.content = "Текст має містити не більше 500 символів";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      await createMutation.mutateAsync(values);
    } catch {
      // Помилка відображається нижче у формі.
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={(event) => {
            setDraft({ title: event.target.value });
          }}
        />

        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={(event) => {
            setDraft({ content: event.target.value });
          }}
        />

        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={(event) => {
            setDraft({
              tag: event.target.value as NoteTag,
            });
          }}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>

      {createMutation.isError && (
        <p className={css.error} role="alert">
          Не вдалося створити нотатку. Спробуйте ще раз.
        </p>
      )}
    </form>
  );
}
