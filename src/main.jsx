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
import SupervisorHomePage from "./pages/supervisorPage/SupervisorHomePage.jsx";
import GlobarLoader from "./utils/GlobalLoader.jsx";
import { LoadingProvider } from "./utils/LoadingContext.jsx";
import NityaSevaReport from "./pages/donorCultivatorHomePage/NityaSevaReport.jsx";
import BankDetails from "./components/BankDetails.jsx";
import FormAndDownload from "./PDF_Components/FormAndDownload.jsx";

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
        path:"bank-details",
        element:<BankDetails />
      },
      {
        path: "receipt",
        element: <FormAndDownload />,
      },
      {
        path: "nitya-seva-report",
        element: <NityaSevaReport />,
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
          <PrivateRoute
            allowedRoles={["donorCultivator"]}
            component={DonorCultivatorHomePage}
          />
        ),
      },
      {
        path: "donor-list",
        element: (
          <PrivateRoute
            allowedRoles={["donationSupervisor", "donorCultivator", "admin"]}
            component={DonorListPage}
          />
        ),
      },
      {
        path: "donor-profile/:id",
        element: (
          <PrivateRoute
            allowedRoles={["donor", "donorCultivator"]}
            component={DonorProfilePage}
          />
        ),
      },
      {
        path: "admin-dashboard",
        element: (
          <PrivateRoute allowedRoles={["admin"]} component={AdminPage} />
        ),
      },
      {
        path: "supervisor-home",
        element: (
          <PrivateRoute
            allowedRoles={["donationSupervisor"]}
            component={SupervisorHomePage}
          />
        ),
      },
    ],
  },
  {
    path: "/login-page",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadingProvider>
      <GlobarLoader />
      <RouterProvider router={router} />
    </LoadingProvider>
  </React.StrictMode>
);
