const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const CHAT_API_BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || "http://133.242.55.61:8000";

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

export interface ChatMessage {
  content: string;
  role: "user" | "assistant";
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
}

export interface QuerySuggestRequest {
  messages: ChatMessage[];
}

export interface QuerySuggestResponse {
  suggest: string[];
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

  sendChatMessage: async (messages: ChatMessage[]): Promise<ChatResponse> => {
    const auth = btoa("admin:tech_worlds_1213");
    const url = `${CHAT_API_BASE_URL}/chat`;
    const payload = { messages };

    console.log("Sending chat request to:", url);
    console.log("Payload:", JSON.stringify(payload, null, 2));
    console.log("Authorization header:", `Basic ${auth}`);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", res.status);
    console.log("Response ok:", res.ok);
    console.log("Response headers:", res.headers);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      throw new Error(`Failed to send chat message: ${res.status} ${errorText}`);
    }

    const responseText = await res.text();
    console.log("Raw response text:", responseText);

    try {
      const data = JSON.parse(responseText);
      console.log("Parsed response data:", data);
      return data;
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      console.error("Response was:", responseText);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
  },

  getQuerySuggestions: async (messages: ChatMessage[]): Promise<QuerySuggestResponse> => {
    const auth = btoa("admin:tech_worlds_1213");
    const url = `${CHAT_API_BASE_URL}/query_suggest`;
    const payload = { messages };

    console.log("Fetching query suggestions from:", url);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    console.log("Query suggest response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Query suggest error:", errorText);
      throw new Error(`Failed to get query suggestions: ${res.status}`);
    }

    const data = await res.json();
    console.log("Query suggestions:", data);
    return data;
  },
};
