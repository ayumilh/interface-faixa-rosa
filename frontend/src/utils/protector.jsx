// components/Protector.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/utils/auth"; // instância client do better-auth

export default function Protector({ allowedTypes = [], children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await auth.api.getSession();

        if (!session?.user) {
          router.replace("/login");
          return;
        }

        const userType = session.user.userType;

        if (!allowedTypes.includes(userType)) {
          router.replace("/login"); // ou para "/" ou erro 403
          return;
        }

        setAuthorized(true);
      } catch (error) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, allowedTypes]);

  if (loading) return <p>Carregando...</p>;

  return authorized ? children : null;
}
