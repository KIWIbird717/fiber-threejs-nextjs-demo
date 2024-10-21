"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col px-6 py-14">
      <Link href={"/basics"}>Basics</Link>
      <Link href={"/animations"}>Animations</Link>
      <Link href={"/events"}>Events</Link>
      <Link href={"/cursor-interaction-and-phisics"}>Cursor interaction and phisics</Link>
    </div>
  );
}
