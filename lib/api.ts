const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserCreateRequest {
  mailaddress: string;
  password: string;
  language: string;
}

export interface UserResponse {
  mailaddress: string;
  language: string;
  created_at: string;
}

export interface EarthquakeResponse {
  seismic_intensity: string;
  disaster_type: string;
}

export interface Card {
  id: number;
  imageUrl: string;
  message: string;
}

export interface NextActionsResponse {
  cards: Card[];
}

export const api = {
  createUser: async (data: UserCreateRequest): Promise<UserResponse> => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail?.[0]?.msg || "Failed to create user");
    }
    return res.json();
  },

  getUser: async (mailaddress: string): Promise<UserResponse> => {
    const res = await fetch(`${API_BASE_URL}/users/${mailaddress}`);
    if (!res.ok) {
         throw new Error("User not found");
    }
    return res.json();
  },

  getEarthquake: async (): Promise<EarthquakeResponse> => {
    const res = await fetch(`${API_BASE_URL}/earthquake`);
    if (!res.ok) throw new Error("Failed to fetch earthquake info");
    return res.json();
  },

  getNextActions: async (email: string, seismic_intensity: string): Promise<NextActionsResponse> => {
    const params = new URLSearchParams({ email, seismic_intensity });
    const res = await fetch(`${API_BASE_URL}/next-actions?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch next actions");
    return res.json();
  },
};
