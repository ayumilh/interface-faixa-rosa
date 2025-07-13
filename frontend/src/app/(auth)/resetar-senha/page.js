// src/app/(auth)/resetar-senha/page.js
import { Suspense } from "react";
import ResetarSenhaClient from "./ResetarSenhaClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-8">Carregando...</div>}>
      <ResetarSenhaClient />
    </Suspense>
  );
}
