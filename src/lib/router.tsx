import { createBrowserRouter } from "react-router";

import App from "@/components/layout/app";

import Home from "@/pages/home";
import Signin from "@/pages/signin";
import PrivateRoute from "@/components/layout/private-route";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <PrivateRoute component={Home} scopes={["REQUIRES_AUTH"]} />,
      },
      {
        path: "signin",
        element: <PrivateRoute component={Signin} scopes={["HIDE_FOR_AUTH"]} />,
      },
    ],
  },
]);

export default router;
