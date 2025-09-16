
import axios from "axios";

const API_URL = "http://localhost:8081/api/";

// =================== AUTH ===================
export const signupUser = async (user) => {
  const res = await axios.post(`${API_URL}auth/signup`, user);
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}auth/login`, { email, password });
  return res.data.token;
};

// =================== ALERTS ===================
export const fetchAlerts = async (token) => {
  const res = await axios.get(`${API_URL}alerts/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addAlert = async (alert, token) => {
  const res = await axios.post(`${API_URL}alerts/add`, alert, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// =================== USERS ===================
export const getAllUsers = async (token) => {
  const res = await axios.get(`${API_URL}users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getUserById = async (id, token) => {
  const res = await axios.get(`${API_URL}users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUser = async (id, updatedUser, token) => {
  const res = await axios.put(`${API_URL}users/${id}`, updatedUser, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteUser = async (id, token) => {
  const res = await axios.delete(`${API_URL}users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// =================== INCIDENTS ===================
export const getPendingIncidents = async (token) => {
  const res = await axios.get(`${API_URL}incidents/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const approveIncident = async (id, token) => {
  const res = await axios.post(`${API_URL}incidents/${id}/approve`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const rejectIncident = async (id, token) => {
  const res = await axios.post(`${API_URL}incidents/${id}/reject`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export async function fetchWeatherData(city) {
  const res = await fetch(`http://localhost:8081/api/weather/current/${city}`);
  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }
  return await res.json();
}

