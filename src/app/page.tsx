"use client";

import { Main } from "../pages/main";
import { SessionProvider } from "next-auth/react";

export default function Home() {

  return (
    <SessionProvider>
      <Main />
    </SessionProvider>
  );
}
