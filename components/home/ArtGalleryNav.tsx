'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Paintbrush, Gem, UserCircle2, MessageCircle, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/gallery', icon: Paintbrush, label: 'Explore' },
  { href: '/auctions', icon: Gem, label: 'Auctions' },
  { href: '/profile', icon: UserCircle2, label: 'Profile' },
  { href: '/contact', icon: MessageCircle, label: 'Connect' },
]

const ArtGalleryNav = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md text-white' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className={`text-2xl md:text-3xl font-bold ${isScrolled ? 'text-white' : 'text-black'} hover:text-amber-400 transition-colors duration-300`}>
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
              style={{ fontFamily: '"Bebas Neue", sans-serif' }}
            >
              The Gallery Vault
            </motion.span>
          </Link>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item, index) => (
              <NavItem key={item.href} item={item} index={index} isScrolled={isScrolled} />
            ))}
          </div>
          <div className="md:hidden">
            <button
              className={`text-black hover:text-amber-400 ${isScrolled ? 'text-white' : 'text black' } transition-colors duration-300`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu items={navItems} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        )}
      </AnimatePresence>
      <motion.div
        className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-400 via-red-500 to-purple-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />
    </nav>
  )
}

const NavItem = ({ item, index, isScrolled }) => (
  <Link href={item.href}>
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={`flex flex-col items-center space-y-1 group-hover:text-amber-400 transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-black'}`}>
        <item.icon className="w-6 h-6" />
        <span className="text-xs font-medium uppercase tracking-wide">{item.label}</span>
      </div>
      <motion.div
        className="absolute -bottom-2 left-0 w-full h-0.5 bg-amber-400"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  </Link>
)

const MobileMenu = ({ items, setIsMobileMenuOpen }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md py-4"
  >
    {items.map((item, index) => (
      <Link
        key={item.href}
        href={item.href}
        className="block py-3 px-4 text-white hover:bg-white/10 transition-colors duration-300"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-sm uppercase tracking-wide">{item.label}</span>
        </motion.div>
      </Link>
    ))}
  </motion.div>
)

export default ArtGalleryNav

