"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// check for emoji regex
function containsEmoji(str: string) {
  const emojiRegex = /\p{Extended_Pictographic}/u;
  return emojiRegex.test(str);
}

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // validation for form
  // title (required) + emoji
  // date (required)
  // location (required)
  function validate() {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = "Title is required.";
    } else if (!containsEmoji(title)) {
      errs.title = "Title must contain at least one emoji.";
    }
    if (!date.trim()) errs.date = "Date is required.";
    if (!location.trim()) errs.location = "Location is required.";
    return errs;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        date,
        location, // send as typed
        description,
      }),
    });
    setSubmitting(false);

    if (res.ok) {
      // trigger banner
      if (typeof window !== "undefined") {
        sessionStorage.setItem("event:created", "1");
      }
      router.replace("/");  
    } else {
      const data = await res.json().catch(() => ({}));
      setErrors({ form: data.error || "Failed to create event" });
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Event</h1>
        <Button variant="ghost" onClick={() => router.push("/")}>
          Cancel
        </Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {errors.form && (
          <p className="text-sm text-destructive">{errors.form}</p>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title *
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={!!errors.title}
            placeholder="e.g. im a title yay 🦕"
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            Date *
          </label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={!!errors.date}
          />
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm">
            Location *
          </label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-invalid={!!errors.location}
            placeholder="My house"
          />
          {errors.location && (
            <p className="text-xs text-destructive">{errors.location}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm">
            Description
          </label>
          <textarea
            id="description"
            className="w-full min-h-[100px] rounded-md border px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Whats going onnnn"
          />
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </main>
  );
}
