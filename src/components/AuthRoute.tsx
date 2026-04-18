import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { clearClientAuthState } from "@/lib/authSession";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

const AuthLoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <p className="text-sm text-muted-foreground">Checking session...</p>
  </div>
);

const useAuthStatus = () => {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    if (!auth) {
      clearClientAuthState();
      setStatus("unauthenticated");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setStatus(user ? "authenticated" : "unauthenticated");
      if (!user) {
        clearClientAuthState();
      }
    });

    return unsubscribe;
  }, []);

  return status;
};

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const status = useAuthStatus();

  if (status === "loading") {
    return <AuthLoadingScreen />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const status = useAuthStatus();

  if (status === "loading") {
    return <AuthLoadingScreen />;
  }

  if (status === "authenticated") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
