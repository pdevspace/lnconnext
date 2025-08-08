import { Calendar, Users, Video, Building2 } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm"
      style={{ height: "70px" }}
    >
      <div
        className="max-w-7xl mx-auto px-4 flex items-center justify-between"
        style={{ height: "70px" }}
      >
        <div className="flex items-center gap-8 w-full">
          <Link href="/">
            <span className="text-xl font-bold tracking-tight text-blue-600 cursor-pointer">
              LNConnext
            </span>
          </Link>
          <div className="flex gap-2">
            <Link href="/calendar">
              <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 transition">
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </button>
            </Link>
            <Link href="/event">
              <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 transition">
                <Users className="h-4 w-4" />
                <span>Event</span>
              </button>
            </Link>
            <Link href="/organizer">
              <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-50 transition">
                <Building2 className="h-4 w-4" />
                <span>Organizers</span>
              </button>
            </Link>
          </div>
          <div className="flex-1" />
        </div>
      </div>
    </nav>
  );
}
