import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const primaryRole = session?.user?.roles?.[0] || session?.user?.primary_role;
  const isActive = (pathname: string) => router.pathname === pathname;

  const commonLinks = [
    { href: "/", label: t("home") },
    { href: "/scripts", label: t("myScripts") },
    { href: "/scripts/new", label: t("newScript") },
  ];

  const adminLinks = [
    { href: "/users", label: t("users") },
    { href: "/dashboard", label: t("dashboard") },
  ];

  const marketerLinks = [{ href: "/profile", label: t("profile") }];

  return (
    <nav className="border-b border-primary-100 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-600">
              PixiScript
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                {commonLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        active={isActive(link.href)}
                        className={`${navigationMenuTriggerStyle()} ${isActive(link.href)
                            ? "text-primary-600 border-primary-600"
                            : "text-gray-800 hover:text-primary-500"
                          }`}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}

                {primaryRole === "admin" &&
                  adminLinks.map((link) => (
                    <NavigationMenuItem key={link.href}>
                      <Link href={link.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          active={isActive(link.href)}
                          className={`${navigationMenuTriggerStyle()} ${isActive(link.href)
                              ? "text-primary-600 border-primary-600"
                              : "text-gray-800 hover:text-primary-500"
                            }`}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}

                {primaryRole === "marketer" &&
                  marketerLinks.map((link) => (
                    <NavigationMenuItem key={link.href}>
                      <Link href={link.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          active={isActive(link.href)}
                          className={`${navigationMenuTriggerStyle()} ${isActive(link.href)
                              ? "text-primary-600 border-primary-600"
                              : "text-gray-800 hover:text-primary-500"
                            }`}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              onClick={() => signOut()}
              className="bg-[#EF4E4E] hover:bg-[#E12D39] text-white font-medium border border-[#CF1124] shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {t("logout")}
            </Button>

            <LanguageSwitcher />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-600">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-3 pt-6">
                  {[...commonLinks, ...(primaryRole === "admin" ? adminLinks : []), ...(primaryRole === "marketer" ? marketerLinks : [])].map(
                    (link) => (
                      <Button
                        key={link.href}
                        variant={isActive(link.href) ? "default" : "ghost"}
                        asChild
                        className={`justify-start ${isActive(link.href)
                            ? "bg-primary-500 text-white"
                            : "hover:bg-primary-50 text-gray-800"
                          }`}
                      >
                        <Link href={link.href}>{link.label}</Link>
                      </Button>
                    )
                  )}

                  <Button
                    variant="ghost"
                    className="justify-start text-red-600 hover:bg-red-50"
                    onClick={() => signOut()}
                  >
                    {t("logout")}
                  </Button>

                  <LanguageSwitcher />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
