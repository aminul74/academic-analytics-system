const BASE_URL = process.env.MOCK_SERVER_URL || "http://localhost:3002";

const api = {
  async get(endpoint: string) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`);
      if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
      return await res.json();
    } catch (error) {
      console.error(`API get error for ${endpoint}:`, error);
      throw error;
    }
  },

  async post(endpoint: string, data: Record<string, any>) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to post to ${endpoint}`);
      return await res.json();
    } catch (error) {
      console.error(`API post error for ${endpoint}:`, error);
      throw error;
    }
  },

  async put(endpoint: string, data: Record<string, any>) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to put to ${endpoint}`);
      return await res.json();
    } catch (error) {
      console.error(`API put error for ${endpoint}:`, error);
      throw error;
    }
  },

  async delete(endpoint: string) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete ${endpoint}`);
      return await res.json();
    } catch (error) {
      console.error(`API delete error for ${endpoint}:`, error);
      throw error;
    }
  },
};

export default api;
