// app/redirect/page.js

import { redirect } from "next/navigation";
import { requireUser } from "@/utils/requireUser";

export default async function RedirectPage() {
  const user = await requireUser(); // pega o cookie automaticamente via SSR

  if (!user) return redirect("/login");

  const redirectMap = {
    ADMIN: "/adminDashboard",
    CONTRATANTE: "/userDashboard",
    ACOMPANHANTE: "/dashboard",
  };

  const target = redirectMap[user.userType] || "/";

  console.log("Redirecionando para:", target);
  return redirect(target);
}
