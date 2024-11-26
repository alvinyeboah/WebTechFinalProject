"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Search, User, ShoppingCart } from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { Button } from "../ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/galleryex", label: "Exhibitions" },
  { href: "/artworks", label: "Artworks" },
  { href: "/auctions", label: "Auctions" },
];

export default function ArtGalleryNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-md" : "bg-[#1A1C20]"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold text-amber-400 hover:text-white transition-colors duration-300"
          >
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
          <div className="hidden md:flex space-x-1">
            {navItems.map((item, index) => (
              <NavItem key={item.href} item={item} index={index} />
            ))}
          </div>
          <div className="flex items-center space-x-4">
            {/* <NavIcon icon={Search} label="Search" /> */}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-amber-400 hover:text-white"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button
                    variant="ghost"
                    className="text-amber-400 hover:text-white"
                  >
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-amber-400 hover:text-white"
                >
                  Sign Out
                </Button>
                <Link href="/cart">
                  <NavIcon icon={ShoppingCart} label="Cart" />
                </Link>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-amber-400 hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
            )}

            <div className="md:hidden">
              <button
                className="text-amber-400 hover:text-white transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            items={navItems}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            user={user}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
      <motion.div
        className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-400 via-red-500 to-purple-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />
    </nav>
  );
}

const NavItem: React.FC<{
  item: { href: string; label: string };
  index: number;
}> = ({ item, index }) => (
  <Link href={item.href}>
    <motion.div
      className="group relative px-3 py-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <span className="relative z-10 text-amber-400 group-hover:text-white transition-colors duration-300">
        {item.label}
      </span>
      <motion.div
        className="absolute inset-0 bg-amber-400/20 rounded-md"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  </Link>
);

const NavIcon: React.FC<{ icon: React.ElementType; label: string }> = ({
  icon: Icon,
  label,
}) => (
  <button
    className="text-amber-400 hover:text-white transition-colors duration-300"
    aria-label={label}
  >
    <Icon className="h-6 w-6" />
  </button>
);

const MobileMenu: React.FC<{
  items: { href: string; label: string }[];
  setIsMobileMenuOpen: (open: boolean) => void;
  user: any;
  onLogout: () => void;
}> = ({ items, setIsMobileMenuOpen, user, onLogout }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="md:hidden absolute top-full left-0 right-0 bg-[#1A1C20] py-4"
  >
    {items.map((item, index) => (
      <Link
        key={item.href}
        href={item.href}
        className="block py-3 px-4 text-amber-400 hover:bg-amber-400/20 hover:text-white transition-colors duration-300"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <span className="text-sm uppercase tracking-wide">{item.label}</span>
        </motion.div>
      </Link>
    ))}

    {/* Auth-related mobile menu items */}
    {user ? (
      <>
        <Link
          href="/dashboard"
          className="block py-3 px-4 text-amber-400 hover:bg-amber-400/20 hover:text-white transition-colors duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          href="/settings"
          className="block py-3 px-4 text-amber-400 hover:bg-amber-400/20 hover:text-white transition-colors duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Settings
        </Link>
        <button
          onClick={() => {
            onLogout();
            setIsMobileMenuOpen(false);
          }}
          className="w-full text-left py-3 px-4 text-amber-400 hover:bg-amber-400/20 hover:text-white transition-colors duration-300"
        >
          Sign Out
        </button>
      </>
    ) : (
      <Link
        href="/auth/login"
        className="block py-3 px-4 text-amber-400 hover:bg-amber-400/20 hover:text-white transition-colors duration-300"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Sign In
      </Link>
    )}
  </motion.div>
);
