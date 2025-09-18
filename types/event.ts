export type Event = {
  id: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  createdAt: string;
};

export type CreateEventRequest = {
  title: string;
  description: string;
  date: string;
  location: string;
}