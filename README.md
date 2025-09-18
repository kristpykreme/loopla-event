
Loopla Technical Test!
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
Install dependencies:
```bash
npm install
# or
yarn install
```
Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features
- **List Events**  
  View all upcoming events on the home page. Events are sorted by title length (by default).

- **Search & Filter**  
  Client-side search bar to filter events by title in real time.

- **Sort by Date**  
  Toggle button cycles through:
  1. Date ascending (oldest -> newest)  
  2. Date descending (newest -> oldest)  
  3. No date sort

- **Create Events**  
  Form at `/create` with client-side validation:
  - Title (required, must include an emoji)  
  - Date (required)  
  - Location (required, stored uppercase in JSON)  
  - Description (optional)

- **Event Detail Page**  
  `/event/[id]` displays full event details.

- **User Feedback**  
  Success toast (Sonner) appears after event creation.
  
## Tech Stack

- Next.js 13+ App Router
- TypeScript
- shadcn/ui (Button, Input, Sonner Toast etc.)
- Tailwind CSS for styling
- JSON file storage (`data/events.json`)

## Project Structure
|─ page.tsx # Home page (list + search + sort)  
|─ create/page.tsx # Event creation form  
└─ event/[id]/page.tsx # Event detail page

 - app/api/events/route.ts # API route for reading/writing events
 - components/ # UI components (Button, Input, Cards, Toast trigger)
 - data/events.json # JSON "database"
 - types/event.ts # Event type definition

# Explanation and Thought Process
**Server-side rendering**
-   **`app/page.tsx`** (home `/`)
    
    -   Fetch events from `GET /api/events` with `cache: 'no-store'` so new creations show up immediately.
        
    -   Ensure the canonical sort (by title length and date) happens on the server.
    -   Render the initial event list for SEO.
        
-   **`app/event/[id]/page.tsx`** (event detail `/event/[id]`)
    
    -   Fetch the single event
        
-   **API routes** (`app/api/events/route.ts`)
    
    -   **GET**: read from JSON file `data/events.json`, apply the canonical sort, return JSON.
        
    -   **POST**: validate again (server-side), uppercase the `location` before persisting, append to the JSON, return the created record.
        

**Client-side rendering**
-   **`app/create/page.tsx`** (Create Event form `/create`)
    
    -   Mark the page/component with `"use client"`.
