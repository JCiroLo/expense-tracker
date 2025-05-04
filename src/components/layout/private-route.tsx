import React from "react";
import { Navigate } from "react-router";
import useSessionStore from "@/stores/use-session-store";

type PrivateRouteProps<Props> = {
  component: React.ComponentType<Props>;
  componentProps?: Props;
  scopes?: ("REQUIRES_AUTH" | "HIDE_FOR_AUTH")[];
};

const PrivateRoute = <P extends React.JSX.IntrinsicAttributes>({
  component: Component,
  scopes = [],
  componentProps: componentProps,
}: PrivateRouteProps<P>) => {
  const user = useSessionStore((state) => state.user);
  const isAuthenticated = Boolean(user);

  if (scopes.includes("REQUIRES_AUTH") && !isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (scopes.includes("HIDE_FOR_AUTH") && isAuthenticated) {
    return <Navigate to="/" />;
  }

  console.log("rendering");

  return <Component {...(componentProps as P)} />;
};

export default PrivateRoute;
