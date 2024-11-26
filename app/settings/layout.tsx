"use client";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Image from "next/image";
import { SidebarNav } from "./components/sidebar-nav";
import { MainNav } from "../dashboard/components/main-nav";
import { Search } from "../dashboard/components/search";
import { UserNav } from "../dashboard/components/user-nav";
import TeamSwitcher from "../dashboard/components/team-switcher";

import { useSession } from "@/context/SessionContext";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Account",
    href: "/settings/account",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
  {
    title: "Display",
    href: "/settings/display",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { user } = useSession();
  return (
    <>
      <div className="flex items-center pr-4">
            {/* <TeamSwitcher user={user} /> will replace this later, probably with logo */}
        {/* <MainNav className="mx-6" /> */}
        <div className="ml-auto flex items-center space-x-4">
          {/* <Search /> */}
          {/* <UserNav /> */}
        </div>
      </div>
      <Separator/>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 p-6 md:block">
        <div className="space-y-0.5">
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
