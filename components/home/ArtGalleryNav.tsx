'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Palette, Frame, Users, Mail } from 'lucide-react'

const ArtGalleryNav = () => {
const [isScrolled, setIsScrolled] = useState(false)

useEffect(() => {
    const handleScroll = () => {
    setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
}, [])

return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
    <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
        <Link href="/" className="text-3xl font-extrabold text-[#E6D5B8]">
            <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
            style={{ fontFamily: '"Poppins", sans-serif'}}
                >
              The Gallery Vault
            </motion.span>
          </Link>
          <div className="hidden md:flex space-x-8">
            {[
              { href: '/gallery', icon: Palette, label: 'Gallery' },
              { href: '/auctions', icon: Frame, label: 'Auctions' },
              { href: '/profile', icon: Users, label: 'Profile' },
              { href: '/contact', icon: Mail, label: 'Contact' },
            ].map((item, index) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className="group relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2 text-[#E6D5B8] group-hover:text-[#F0A500]">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F0A500]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="md:hidden">
            <button className="text-[#E6D5B8] hover:text-[#F0A500]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            </button>
        </div>
        </div>
    </div>
    <div
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#1A1C20] via-[#F0A500] to-[#E6D5B8]"
        style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}
    />
    </nav>
)
}

export default ArtGalleryNav