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
import LanguageSwitcher from "./LanguageSwitcher"; // ⬅️ import it here
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Get the first role from the roles array in session
  const primaryRole = session?.user?.roles?.[0] || session?.user?.primary_role;

  // Helper function to check if a link is active
  const isActive = (pathname: string) => {
    return router.pathname === pathname;
  };

const commonLinks = [
  { href: "/", label: t("home") },
  { href: "/scripts", label: t("myScripts") },
  { href: "/scripts/new", label: t("newScript") },
];

const adminLinks = [
  { href: "/users", label: t("users") },
  { href: "/dashboard", label: t("dashboard") },
];

const marketerLinks = [
  { href: "/profile", label: t("profile") },
];

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-green-600">
              PixiScript
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                {commonLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        active={isActive(link.href)}
                        className={navigationMenuTriggerStyle()}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}

                {primaryRole === "admin" && adminLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        active={isActive(link.href)}
                        className={navigationMenuTriggerStyle()}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}

                {primaryRole === "marketer" && marketerLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        active={isActive(link.href)}
                        className={navigationMenuTriggerStyle()}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <Button onClick={() => signOut()} variant="destructive" asChild>
              <Link href="../">{t("logout")}</Link>
            </Button>
            <LanguageSwitcher />

          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 pt-6">
                  {commonLinks.map((link) => (
                    <Button
                      key={link.href}
                      variant={isActive(link.href) ? "default" : "ghost"}
                      asChild
                      className="justify-start"
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ))}

                  {primaryRole === "admin" && adminLinks.map((link) => (
                    <Button
                      key={link.href}
                      variant={isActive(link.href) ? "default" : "ghost"}
                      asChild
                      className="justify-start"
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ))}

                  {primaryRole === "marketer" && marketerLinks.map((link) => (
                    <Button
                      key={link.href}
                      variant={isActive(link.href) ? "default" : "ghost"}
                      asChild
                      className="justify-start"
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ))}

                  <Button variant="destructive" asChild className="justify-start">
                    <Link href="/logout">Logout</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}