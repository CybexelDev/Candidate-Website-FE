import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./Admin/Pages/Login/AdminLogin";
import AuthenticationPage from "./Pages/AuthenticationPage/AuthenticationPage";
import SubmitPage from "./Pages/SubmitPage/SubmitPage";
import AdminDashboard from "./Admin/Pages/Dashboard/Dashboard";
import UploadCampaigns from "./Admin/Pages/UploadCampaign/UploadCampaign";
import CandidatesAdminPage from "./Admin/Pages/Candidate/Candidate";
import CandidateDetailsPage from "./Admin/Pages/CandidateDetails/CandidateDetails";
import AdminProtectedRoute from "./Admin/Components/AdminProtectionRoute/AdminProtectionRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>
    <Route
  path="/upload/:token"
  element={<AuthenticationPage />}
/>
       <Route
  path="/submit-form/:token"
  element={<SubmitPage />}
/>

{/* admin side */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
        <Route path="/admin/dashboard"
        element={
        <AdminProtectedRoute>
        <AdminDashboard/>

        </AdminProtectedRoute>}/>
   
        <Route path="/admin/upload-link"
        element={
        <AdminProtectedRoute>
            <UploadCampaigns/>
        </AdminProtectedRoute>
      }/>
        <Route path="/admin/candidate"
        element={<AdminProtectedRoute>
<CandidatesAdminPage/>
        </AdminProtectedRoute>
        }/>
         <Route path="/admin/candidate-details/:id"
        element={
        <AdminProtectedRoute>
<CandidateDetailsPage/>
        </AdminProtectedRoute>
        }/>
      </Routes>
      

    </BrowserRouter>
  );
}

export default App;