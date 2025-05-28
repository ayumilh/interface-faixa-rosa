import { Suspense } from "react";
import ResetarSenhaClient from "@/components/Auth/ResetarSenhaClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">Carregando...</div>}>
      <ResetarSenhaClient />
    </Suspense>
  );
}
