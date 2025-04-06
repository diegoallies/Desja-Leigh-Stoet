// components/Navbar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-[#3e3a36]">
          Desja Leigh Stoet
        </span>
        <div className="sm:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="hidden sm:flex gap-6 text-sm sm:text-base">
          <NavLinks />
        </div>
      </div>
      {open && (
        <div className="sm:hidden mt-4 flex flex-col gap-3 text-sm">
          <NavLinks />
        </div>
      )}
    </nav>
  )
}

function NavLinks() {
  return (
    <>
      <Link href="/" className="hover:underline">Dashboard</Link>
      <Link href="/sheep" className="hover:underline">Sheep</Link>
      <Link href="/health" className="hover:underline">Health Monitoring</Link>
      <Link href="/feed" className="hover:underline">Feed Optimization</Link>
      <Link href="/calculator" className="hover:underline">Livestock Calc</Link>
    </>
  )
} 

// Example usage:
// import Navbar from '@/components/Navbar'
// Place <Navbar /> at the top of your layout or page
