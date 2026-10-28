import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

const baseUrl = "https://notehub.com/";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  const title = `${note.title} | NoteHub`;
  const description =
    note.content.trim().slice(0, 160) ||
    `View the note "${note.title}" in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}notes/${id}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "NoteHub application for managing personal notes",
        },
      ],
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
