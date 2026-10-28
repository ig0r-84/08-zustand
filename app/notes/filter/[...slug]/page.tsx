import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

const baseUrl = "https://notehub.com/";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] ?? "all";

  const filterName = tag === "all" ? "All notes" : `${tag} notes`;

  const title = `${filterName} | NoteHub`;
  const description =
    tag === "all"
      ? "View and manage all your notes in NoteHub."
      : `View and manage your ${tag} notes in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: baseUrl,
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

export default async function NotesPage({
  params,
  searchParams,
}: NotesPageProps) {
  const { slug } = await params;
  const { search = "", page = "1" } = await searchParams;

  const tag = slug[0] ?? "all";
  const currentPage = Number(page) || 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", search, currentPage, tag],
    queryFn: () => fetchNotes(search, currentPage, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient search={search} page={currentPage} tag={tag} />
    </HydrationBoundary>
  );
}
