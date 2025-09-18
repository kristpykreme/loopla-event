import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import type { Event } from "@/types/event";

const filePath = path.join(process.cwd(), "data", "events.json");

async function readEvents(): Promise<Event[]> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Event[];
}

async function writeEvents(events: Event[]) {
  await fs.writeFile(filePath, JSON.stringify(events, null, 2), "utf-8");
}

function endsWithEmoji(s: string) {
  const emojiAtEnd = /(\p{Extended_Pictographic}\uFE0F?)+$/u;
  return emojiAtEnd.test(s.trim());
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = String(body.title ?? "").trim();
    const description =
      typeof body.description === "string" ? body.description : "";
    const date = String(body.date ?? "").trim();
    const location = String(body.location ?? "")
      .trim()
      .toUpperCase();

    if (!title)
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!endsWithEmoji(title)) {
      return NextResponse.json(
        { error: "Title must end with at least one emoji" },
        { status: 400 }
      );
    }
    if (!date)
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    if (!location)
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );

    const events = await readEvents();
    const nextId = (
      Math.max(0, ...events.map((e) => Number(e.id) || 0)) + 1
    ).toString();

    const newEvent: Event = {
      id: nextId,
      title,
      description,
      date,
      location,
      createdAt: new Date().toISOString(),
    };

    events.push(newEvent);
    await writeEvents(events);

    return NextResponse.json(newEvent, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
