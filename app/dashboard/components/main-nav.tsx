import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {}

export function MainNav({ className, ...props }: MainNavProps) {
  const pathname = usePathname();
  const { user } = useRequireAuth();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      className={cn(
        "flex items-center space-x-4 lg:space-x-6 p-3 rounded-md bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {user?.userRole === "BUYER" ? (
        ""
      ) : (
        <Link
          href="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors rounded-md p-5 py-2",
            isActive("/dashboard")
              ? "text-primary font-semibold bg-gray-100"
              : "text-gray-600 hover:text-primary hover:bg-gray-50"
          )}
        >
          Dashboard
        </Link>
      )}

      <Link
        href="/settings"
        className={cn(
          "text-sm font-medium transition-colors rounded-md px-3 py-2",
          isActive("/settings")
            ? "text-primary font-semibold bg-gray-100"
            : "text-gray-600 hover:text-primary hover:bg-gray-50"
        )}
      >
        Settings
      </Link>
    </nav>
  );
}
