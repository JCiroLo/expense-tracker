import { createBrowserRouter } from "react-router";
import Analytics from "@/pages/analytics";
import Home from "@/pages/home";
import Signin from "@/pages/signin";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsAndConditions from "@/pages/terms-and-conditions";
import AppWrapper from "@/components/layout/app-wrapper";
import AuthWrapper from "@/components/layout/auth-wrapper";
import PrivateRoute from "@/components/layout/private-route";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWrapper />,
    children: [
      {
        path: "",
        element: <PrivateRoute component={Home} scopes={["REQUIRES_AUTH"]} />,
      },
      {
        path: "analytics",
        element: <PrivateRoute component={Analytics} scopes={["REQUIRES_AUTH"]} />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthWrapper />,
    children: [
      {
        path: "signin",
        element: <PrivateRoute component={Signin} scopes={["HIDE_FOR_AUTH"]} />,
      },
    ],
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-and-conditions",
    element: <TermsAndConditions />,
  },
]);

export default router;
