"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/inscripcion", label: "Ser guía" },
    { href: "/programacion", label: "Programación" },
    { href: "/transmision", label: "Transmisión en vivo" },
    { href: "/privacidad", label: "Privacidad" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-navy text-cream shadow-lg shadow-navy/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold md:h-10 md:w-10">
            <span className="font-script text-xl text-gold md:text-2xl">M</span>
          </div>
          <span className="font-serif text-lg font-bold text-cream md:text-xl">
            72 Horas con <span className="font-script text-gold">María</span>
          </span>
        </Link>

        <div className="hidden flex-1 justify-evenly px-6 md:flex lg:px-12">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cream/90 transition hover:text-gold lg:text-base"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          className="text-cream md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gold/20 bg-navy px-6 pb-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-3 text-cream/90 hover:text-gold"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
