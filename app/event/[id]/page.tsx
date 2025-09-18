import type { Event } from "@/types/event";
import events from "@/data/events.json";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

const dtf = new Intl.DateTimeFormat("en-SG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});
function formatISO(iso: string) {
  return dtf.format(new Date(iso));
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const ev = (events as Event[]).find((e) => e.id === params.id) ?? null;
  if (!ev) notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event Details</h1>
        <Button asChild variant="outline">
          <Link href="/">Back to Events</Link>
        </Button>
      </div>

      {/* content */}
      <article className="space-y-4">
        <header className="space-y-1">
          <h2 className="text-3xl font-semibold">{ev.title}</h2>
          <p className="text-muted-foreground">Event date: {ev.date}</p>
          <p className="text-sm uppercase text-gray-600">{ev.location}</p>
        </header>

        {ev.description && (
          <section>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="leading-relaxed">{ev.description}</p>
          </section>
        )}

        <footer className="text-xs text-muted-foreground">
          Created:{" "}
          <time dateTime={ev.createdAt}>{formatISO(ev.createdAt)}</time>
        </footer>
      </article>
    </main>
  );
}
