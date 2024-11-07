import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { UserRole } from "@/types/user";
import toast from "react-hot-toast";

export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { user, isLoading, checkSession } = useSession();
  const router = useRouter();
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        if (!toastShown) {
          setToastShown(true);
          toast.error("Please sign in to access this page");
        }
        router.push("/auth/login");
      } else if (user.userRole === UserRole.BUYER) {
        if (!toastShown) {
          setToastShown(true);
          toast.error("You need to change your user type to access this page");
        }
        setTimeout(() => {
          router.push('/settings'); // Redirect to settings
        }, 5000);
      } else if (allowedRoles && !allowedRoles.includes(user.userRole)) {
        if (!toastShown) {
          setToastShown(true);
          toast.error("You do not have permission to access this page");
        }
        router.push("/unauthorized");
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  return { user, isLoading, checkSession };
}