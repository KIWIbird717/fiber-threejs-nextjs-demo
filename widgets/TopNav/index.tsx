import Link from "next/link";
import React from "react";

export const TopNav = () => {
  return (
    <div className="fixed left-0 top-0 z-[1000] flex h-[40px] w-full items-center bg-slate-800 px-6">
      <Link href={"/"}>Back to main</Link>
    </div>
  );
};
