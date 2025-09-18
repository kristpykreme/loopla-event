"use client";

import { useMemo, useState } from "react";
import type { Event } from "@/types/event";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const dtf = new Intl.DateTimeFormat("en-SG", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

function formatCreatedAt(iso: string) {
  return dtf.format(new Date(iso));
}

// walks through events object and return it as it is
function objx<T>(input: T): T {
  function walk(v: any): any {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      const out: Record<string, any> = {};
      for (const [k, val] of Object.entries(v)) out[k] = walk(val);
      return out;
    }
    return v;
  }
  return walk(input);
}

export default function SearchAndList({ events }: { events: Event[] }) {
  const [search, setSearch] = useState("");

  // only recomputes when the events prop changes, not on every keystroke in search bar
  const base = useMemo(() => objx(events), [events]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return base;
    return base.filter((e) => e.title.toLowerCase().includes(query));
  }, [base, search]);

  return (
    <section>
      <div className="mb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
        />
      </div>

      <div className="space-y-4">
        {filtered.map((e) => (
          <Card key={e.id}>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">{e.title}</CardTitle>
              <CardDescription>{e.date}</CardDescription>
              <CardAction className="text-sm uppercase">
                {e.location}
              </CardAction>
            </CardHeader>

            {e.description && (
              <CardContent className="py-4">
                <p>{e.description}</p>
              </CardContent>
            )}

            <CardFooter className="border-t text-xs">
              <time dateTime={e.createdAt}>{formatCreatedAt(e.createdAt)}</time>
            </CardFooter>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 italic">No events found.</p>
        )}
      </div>
    </section>
  );
}
