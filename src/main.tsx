import React from "react";
import ReactDOM from "react-dom/client";
import ErrorPage from "./error-page";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DonationWidget from "./DonationWidget";
import FrontPage from "./FrontPage";
import FirstTimePage from "./FirstTimePage";
import ManagerPage from "./ManagerPage";
import DonationPage from "./DonationPage";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const router = createBrowserRouter([
  {
    path: "/FirstTime",
    element: <FirstTimePage />,
  },
  {
    path: "/Manager",
    element: <ManagerPage />,
  },
  {
    path: "/DonationWidget/:contractAddress",
    element: <DonationWidget />,
  },
  {
    path: "/Donation/:contractAddress",
    element: <DonationPage />,
  },
  {
    path: "/",
    element: <FrontPage />,
    errorElement: <ErrorPage />,
  },
]);

// edit the index.html build to include <noscript>
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
