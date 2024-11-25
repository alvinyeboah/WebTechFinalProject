import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { UserRole } from "@/types/user";
import toast from "react-hot-toast";

type TargetPage = "dashboard" | "other";

export function useRequireAuth(allowedRoles?: UserRole[], targetPage: TargetPage = "other") {
  const { user, isLoading, checkSession } = useSession();
  const router = useRouter();
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  const handleAuthRedirect = useCallback(() => {
    if (!user) {
      toast.error("Please sign in to access this page", {
        id: "auth-toast",
        duration: 4000
      });
      router.push("/auth/login");
      return true;
    }

    // Only show buyer restriction message on dashboard
    if (targetPage === "dashboard" && user.userRole === UserRole.BUYER) {
      toast.error("You need to change your user type to access this page", {
        id: "role-toast",
        duration: 4000
      });
      router.push('/settings');
      return true;
    }

    if (allowedRoles && !allowedRoles.includes(user.userRole)) {
      toast.error("You do not have permission to access this page", {
        id: "permission-toast",
        duration: 4000
      });
      router.push("/unauthorized");
      return true;
    }

    return false;
  }, [user, router, allowedRoles, targetPage]);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      if (isInitialCheck) {
        await checkSession();
        setIsInitialCheck(false);
      }

      if (!isLoading && mounted) {
        handleAuthRedirect();
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [isLoading, handleAuthRedirect, checkSession, isInitialCheck]);

  // Return true if authenticated and authorized
  const isAuthorized = !isLoading && user && 
    (!allowedRoles || allowedRoles.includes(user.userRole)) && 
    !(targetPage === "dashboard" && user?.userRole === UserRole.BUYER);

  return { user, isLoading, isAuthorized, checkSession };
}