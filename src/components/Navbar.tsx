"use client";

import { Calendar, Users, Building2, Info, Video, Sun, Moon, Monitor, User } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/utils/ThemeContext";

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();

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

  return (
    <nav
      className="fixed h-16 top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div
        className="max-w-7xl h-16 mx-auto px-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-8 w-full">
          <Link href="/">
            <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400 cursor-pointer">
              LNConnext
            </span>
          </Link>
          <div className="flex gap-2">
            <Link href="/event">
              <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300">
                <Users className="h-4 w-4" />
                <span>Event</span>
              </button>
            </Link>
            <Link href="/event">
              <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300">
                <Video className="h-4 w-4" />
                <span>Content</span>
              </button>
            </Link>
            <Link href="/bitcoiner">
              <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300">
                <User className="h-4 w-4" />
                <span>Bitcoiners</span>
              </button>
            </Link>
            <Link href="/organizer">
              <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300">
                <Building2 className="h-4 w-4" />
                <span>Organizers</span>
              </button>
            </Link>
            <Link href="/calendar">
              <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </button>
            </Link>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
              title={`Current theme: ${theme} (${resolvedTheme})`}
            >
              {getThemeIcon()}
            </button>
            <Link href="/info">
              <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300">
                <Info className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
