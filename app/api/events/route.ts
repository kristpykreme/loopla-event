import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import type { Event } from "@/types/event";

const filePath = path.join(process.cwd(), "data", "events.json");

async function readEvents(): Promise<Event[]> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Event[];
}

function sortByTitleLength(events: Event[]) {
  return events
    .slice()
    .sort(
      (a, b) =>
        a.title.length - b.title.length ||
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    );
}

export async function GET() {
  try {
    const events = await readEvents();
    const sorted = sortByTitleLength(events);
    return NextResponse.json(sorted, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to read events" },
      { status: 500 }
    );
  }
}
