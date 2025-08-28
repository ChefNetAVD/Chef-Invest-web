"use client";

import { Logo } from "../ui/Logo";
import { Navigation } from "../ui/Navigation";

export function Header() {
  return (
    <header className="header-toolbar">
      <Logo />
      <Navigation />
    </header>
  );
} 