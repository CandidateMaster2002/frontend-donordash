import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./styles/tailwind.css";
import "flowbite";
import DonorSignupForm from "./pages/donorSignupForm/DonorSignupForm.jsx";
import LoginPage from "./pages/loginPage/LoginPage.jsx";
import DonorHomePage from "./pages/donorHomePage/DonorHomePage.jsx";
import DonorCultivatorHomePage from "./pages/donorCultivatorHomePage/DonorCultivatorHomePage.jsx";
import DonorListPage from "./pages/DonorData.jsx/DonorListPage.jsx";
import DonorProfilePage from "./pages/DonorData.jsx/DonorProfilePage.jsx";
import AdminPage from "./pages/adminPage/AdminPage.jsx";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import Receipt from "./pages/receipt/Receipt.jsx";
// Define routes properly using Outlet in App.jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "donor-signup",
        element: <DonorSignupForm />,
      },
      {
        path:"receipt",
        element:<Receipt/>
      },
      {
        path: "donor-home",
        element: (
          <PrivateRoute allowedRoles={["donor"]} component={DonorHomePage} />
        ),
      },
      {
        path: "donor-cultivator-home",
        element: (
          <PrivateRoute allowedRoles={["donorCultivator"]} component={DonorCultivatorHomePage} />
        ),
      },
      {
        path: "donor-list",
        element: (
          <PrivateRoute allowedRoles={["donationSupervisor","donorCultivator","admin"]} component={DonorListPage} />
        ),
      },
      {
        path: "donor-profile/:id",
        element: (
          <PrivateRoute allowedRoles={["donor", "donorCultivator"]} component={DonorProfilePage} />
        ),
      },
      {
        path: "admin-dashboard",
        element: (
          <PrivateRoute allowedRoles={["admin"]} component={AdminPage} />
        ),
      },
      // {
      //   path: "supervisor-home",
      //   element: (
      //     <PrivateRoute allowedRoles={["donationSupervisor"]} component={SupervisorHomePage} />
      //   ),
      // },
    ],
  },
  {
    path: "/login-page",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);