import Link from "next/link";

export default function NoteNotFound() {
  return (
    <main>
      <h1>Note not found</h1>
      <p>The requested note could not be found.</p>
      <Link href="/notes">Back to notes</Link>
    </main>
  );
}
