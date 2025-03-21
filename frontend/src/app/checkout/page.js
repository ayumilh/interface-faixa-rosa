'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "../../components/CheckoutForm";

export default function CheckoutPage() {
  // const [planId, setPlanId] = useState(null);
  // const router = useRouter();

  // useEffect(() => {
  //   if (router.query && router.query.planId) {
  //     setPlanId(router.query.planId);
  //   }
  // }, [router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4 py-8">
      <CheckoutForm  />
    </div>
  );
}
