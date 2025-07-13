// src/pages/_app.js
"use client";

import { ContactProvider } from "../context/ContactContext";
import { WorkingHoursProvider } from "../context/WorkingHoursContext";

export default function App({ Component, pageProps }) {
  return (
    <ContactProvider>
      <WorkingHoursProvider>
        <Component {...pageProps} />
      </WorkingHoursProvider>
    </ContactProvider>
  );
}
