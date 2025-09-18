"use client";

import { useMemo, useState } from "react";
import type { Event } from "@/types/event";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

type SortMode = "none" | "asc" | "desc";

export default function SearchAndList({ events }: { events: Event[] }) {
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("none");

  // only recomputes when the events prop changes, not on every keystroke in search bar
  const base = useMemo(() => objx(events), [events]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let result = !query
      ? base
      : base.filter((e) => e.title.toLowerCase().includes(query));

    if (sortMode !== "none") {
      result = [...result].sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        if (Number.isNaN(da) || Number.isNaN(db)) return 0;
        return sortMode === "asc" ? da - db : db - da;
      });
    }

    return result;
  }, [base, search, sortMode]);

  const sortLabel =
    sortMode === "none"
      ? "No Date Sort"
      : sortMode === "asc"
      ? "Date (Oldest)"
      : "Date (Newest)";

  function cycleSort() {
    setSortMode((m) => (m === "none" ? "asc" : m === "asc" ? "desc" : "none"));
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className="flex-1"
        />
        <Button
          variant={sortMode === "none" ? "outline" : "secondary"}
          onClick={cycleSort}
        >
          {sortLabel}
        </Button>
      </div>

      <div className="space-y-4">
        {filtered.map((e) => (
          <Card key={e.id}>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">{e.title}</CardTitle>
              <CardDescription>Event date: {e.date}</CardDescription>
              <CardAction className="text-sm uppercase">
                {e.location}
              </CardAction>
            </CardHeader>

            {e.description && (
              <CardContent className="py-4">
                <p>{e.description}</p>
              </CardContent>
            )}

            <CardFooter className="border-t text-xs gap-1">
              Created:
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
