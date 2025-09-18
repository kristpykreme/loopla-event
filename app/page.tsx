import type { Event } from "@/types/event";
import SearchAndList from "@/components/SearchAndList";

export default async function Page() {
  const res = await fetch("http://localhost:3000/api/events", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load events");
  }
  const events: Event[] = await res.json();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <SearchAndList events={events} />
    </main>
  );
}
