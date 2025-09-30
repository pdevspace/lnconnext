"use client";

import { Calendar, Users, Building2, Info, Video, Sun, Moon, Monitor, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/utils/ThemeContext";
import { useState } from "react";

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-4 w-4" />;
    }
    return resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className="fixed h-16 top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="max-w-7xl h-16 mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={closeMobileMenu}>
          <span className="text-xl font-bold tracking-tight text-orange-600 dark:text-orange-400 cursor-pointer">
            Bitcoin Events
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/event">
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]">
              <Users className="h-4 w-4" />
              <span>Events</span>
            </button>
          </Link>
          <Link href="/bitcoiner">
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]">
              <User className="h-4 w-4" />
              <span>Bitcoiners</span>
            </button>
          </Link>
          <Link href="/organizer">
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]">
              <Building2 className="h-4 w-4" />
              <span>Organizers</span>
            </button>
          </Link>
          <Link href="/calendar">
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]">
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </button>
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]"
            title={`Current theme: ${theme} (${resolvedTheme})`}
          >
            {getThemeIcon()}
          </button>
          <Link href="/info">
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]">
              <Info className="h-5 w-5" />
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            <Link href="/event" onClick={closeMobileMenu}>
              <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]">
                <Users className="h-5 w-5" />
                <span>Events</span>
              </button>
            </Link>
            <Link href="/bitcoiner" onClick={closeMobileMenu}>
              <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]">
                <User className="h-5 w-5" />
                <span>Bitcoiners</span>
              </button>
            </Link>
            <Link href="/organizer" onClick={closeMobileMenu}>
              <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]">
                <Building2 className="h-5 w-5" />
                <span>Organizers</span>
              </button>
            </Link>
            <Link href="/calendar" onClick={closeMobileMenu}>
              <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]">
                <Calendar className="h-5 w-5" />
                <span>Calendar</span>
              </button>
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <button
              onClick={() => {
                toggleTheme();
                closeMobileMenu();
              }}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]"
            >
              {getThemeIcon()}
              <span>Theme</span>
            </button>
            <Link href="/info" onClick={closeMobileMenu}>
              <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 min-h-[44px]">
                <Info className="h-5 w-5" />
                <span>Info</span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
