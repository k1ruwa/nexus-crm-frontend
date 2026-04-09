import { createBrowserRouter } from "react-router";
import { Root } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AddContact from "./pages/AddContact";
import ContactDetail from "./pages/ContactDetail";
import Reminders from "./pages/Reminders";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "add", Component: AddContact },
      { path: "contact/:id", Component: ContactDetail },
      { path: "reminders", Component: Reminders },
    ],
  },
]);
