import React from "react";
import ReactDOM from "react-dom/client";
//import Connect from "./Connect";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CWidget from "./page4";
import Donation from "./page6";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const router = createBrowserRouter([
  /*{
    path: "/",
    element: <Connect />,
  },*/
  {
    path: "/page4",
    element: <CWidget />,
  },
  {
    path: "/page6",
    element: <Donation />,
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
