import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import useSessionStore from "@/stores/use-session-store";
import { auth } from "@/lib/firebase";

type SessionManagerProps = {
  children: React.ReactNode;
};

const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const setUser = useSessionStore((state) => state.setUser);

  React.useEffect(() => {
    console.log("session manager");

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("user changed", firebaseUser);

      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, [setUser]);

  return children;
};

export default SessionManager;
