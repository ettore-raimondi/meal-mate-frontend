export type RunStatus = "OPEN" | "CLOSED" | "IN_PROGRESS" | "COMPLETED";
export type CreateRunPayload = {
  name: string;
  description?: string;
  restaurant_id: number;
  deadline: string;
  status: RunStatus;
};

export type RunResponse = {
  id: number;
  name: string;
  organizer: number;
  organizer_name: string;
  description?: string;
  restaurant: number;
  deadline: string;
  status: RunStatus;
  created_at?: string;
  updated_at?: string;
};

export type Run = {
  id: number;
  name: string;
  restaurantId: number;
  deadline: Date;
  description?: string;
  status: RunStatus;
  organizerId: number;
  createdAt?: Date;
  updatedAt?: Date;
  organizerName: string;
};
