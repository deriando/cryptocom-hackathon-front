import React from "react";
import ReactDOM from "react-dom/client";
import Connect from "./Connect";
import ErrorPage from "./error-page";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CWidget from "./page4";
import Donation from "./page6";
import FrontPage from "./FrontPage";
import FirstTimerPage from "./FirstTimerPage";
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
    element: <FirstTimerPage />,
  },
  {
    path: "/Manager",
    element: <ManagerPage />,
  },
  {
    path: "/page4",
    element: <CWidget />,
  },
  {
    path: "/page6",
    element: <Donation />,
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
