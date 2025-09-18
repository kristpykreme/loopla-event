"use client";

import { useMemo, useState } from "react";
import type { Event } from "@/types/event";
import { Input } from "@/components/ui/input"

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

      <ul className="space-y-4">
        {filtered.map((e) => (
          <li key={e.id} className="border rounded-lg p-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">{e.title}</h2>
              <span className="text-sm text-gray-500">{e.date}</span>
            </div>
            <div className="text-lg">{e.description}</div>
            <div className="text-sm text-gray-600 uppercase">{e.location}</div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-sm text-gray-500 italic">No events found.</li>
        )}
      </ul>
    </section>
  );
}
