import { useEffect, useState } from "react";

import api from "@/lib/api";

type User = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
};

export function useUser() {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/users/me");

      setUser(res.data);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    setUser,
    fetchUser,
    loading,
  };
}