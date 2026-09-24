// Auth API service — communicates with the Express backend
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Create axios instance with credentials enabled (for cookies)
const authAxios = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Sign up a new user
export async function signupApi(email, password) {
  const response = await authAxios.post("/auth/signup", { email, password });
  return response.data;
}

// Log in an existing user
export async function loginApi(email, password) {
  const response = await authAxios.post("/auth/login", { email, password });
  return response.data;
}

// Log out the current user
export async function logoutApi() {
  const response = await authAxios.post("/auth/logout");
  return response.data;
}

// Get the current user's profile
export async function getMeApi() {
  const response = await authAxios.get("/auth/me");
  return response.data;
}

// Get user's collection from backend
export async function getCollectionApi() {
  const response = await authAxios.get("/collection");
  return response.data;
}

// Add item to user's collection
export async function addToCollectionApi(item) {
  const response = await authAxios.post("/collection", item);
  return response.data;
}

// Remove item from user's collection
export async function removeFromCollectionApi(itemId) {
  const response = await authAxios.delete(`/collection/${itemId}`);
  return response.data;
}

// Remove all items from the current user's collection
export async function clearCollectionApi() {
  const response = await authAxios.delete("/collection");
  return response.data;
}
