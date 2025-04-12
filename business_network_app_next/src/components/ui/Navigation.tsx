'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Users,
  Briefcase,
  Calendar,
  Building2,
  Menu,
  LogOut,
  UserCircle,
  Settings
} from 'lucide-react';
import { auth } from '@/lib/firebase/auth';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const mainNavItems: NavItem[] = [
  { name: 'Netzwerk', href: '/network', icon: <Users className="w-5 h-5" /> },
  { name: 'Jobs', href: '/jobs', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Verfügbarkeiten', href: '/availability', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Firmen', href: '/companies', icon: <Building2 className="w-5 h-5" /> },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center font-display text-xl font-bold text-gray-900">
              Berner Netzwerker
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  inline-flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}

            {/* User Menu */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  aria-label="User menu"
                >
                  <UserCircle className="h-6 w-6" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] rounded-lg bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5"
                  sideOffset={5}
                >
                  <DropdownMenu.Item className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm text-gray-700 outline-none hover:bg-gray-100 hover:text-gray-900">
                    <Link href="/profile" className="flex items-center space-x-2">
                      <UserCircle className="h-5 w-5" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm text-gray-700 outline-none hover:bg-gray-100 hover:text-gray-900">
                    <Link href="/settings" className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Einstellungen</span>
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
                  <DropdownMenu.Item
                    className="flex cursor-pointer items-center space-x-2 rounded-md px-4 py-2 text-sm text-red-600 outline-none hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Abmelden</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  block rounded-lg px-3 py-2 text-base font-medium
                  ${pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.name}</span>
                </span>
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4">
              <Link
                href="/profile"
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center space-x-2">
                  <UserCircle className="h-5 w-5" />
                  <span>Profil</span>
                </span>
              </Link>
              <Link
                href="/settings"
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Einstellungen</span>
                </span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50"
              >
                <span className="flex items-center space-x-2">
                  <LogOut className="h-5 w-5" />
                  <span>Abmelden</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
