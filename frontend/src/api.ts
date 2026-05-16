import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

export const updateProfile = async (data: {
  username: string;
  bio: string;
}) => {
  return api.put("/users/me", data);
};


export const uploadAvatar = async (
  formData: FormData
) => {
  return api.post(
    "/users/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};