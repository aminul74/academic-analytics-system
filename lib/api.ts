import axios from "axios";

const BASE_URL = process.env.MOCK_SERVER_URL || "http://localhost:3002";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const api = {
  async get(endpoint: string | number) {
    const path = String(endpoint);
    try {
      const res = await axiosInstance.get(path);
      return res.data;
    } catch (error) {
      console.error(`API get error for ${path}:`, error);
      throw error;
    }
  },

  async post(endpoint: string | number, data: Record<string, any>) {
    const path = String(endpoint);
    try {
      const res = await axiosInstance.post(path, data);
      return res.data;
    } catch (error) {
      console.error(`API post error for ${path}:`, error);
      throw error;
    }
  },

  async put(endpoint: string | number, data: Record<string, any>) {
    const path = String(endpoint);
    try {
      const res = await axiosInstance.put(path, data);
      return res.data;
    } catch (error) {
      console.error(`API put error for ${path}:`, error);
      throw error;
    }
  },

  async delete(endpoint: string | number) {
    const path = String(endpoint);
    try {
      const res = await axiosInstance.delete(path);
      return res.data;
    } catch (error) {
      console.error(`API delete error for ${path}:`, error);
      throw error;
    }
  },
};

export default api;
