import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CollegeDashboard from "./pages/college/CollegeDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import CollegeCompanies from "./pages/college/CollegeCompanies";
import CollegeApprovals from "./pages/college/CollegeApprovals";
import CollegeStudents from "./pages/college/CollegeStudents";
import CollegeReports from "./pages/college/CollegeReports";
import CollegeProfile from "./pages/college/CollegeProfile";
import CompanyPostJob from "./pages/company/CompanyPostJob";
import CompanyApplications from "./pages/company/CompanyApplications";
import CompanyShortlisted from "./pages/company/CompanyShortlisted";
import CompanyProfile from "./pages/company/CompanyProfile";
import StudentCompanies from "./pages/student/StudentCompanies";
import StudentApplications from "./pages/student/StudentApplications";
import StudentProfile from "./pages/student/StudentProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/college/dashboard" element={
              <ProtectedRoute allowedRole="college">
                <CollegeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/college/companies" element={
              <ProtectedRoute allowedRole="college">
                <CollegeCompanies />
              </ProtectedRoute>
            } />
            <Route path="/college/approvals" element={
              <ProtectedRoute allowedRole="college">
                <CollegeApprovals />
              </ProtectedRoute>
            } />
            <Route path="/college/students" element={
              <ProtectedRoute allowedRole="college">
                <CollegeStudents />
              </ProtectedRoute>
            } />
            <Route path="/college/reports" element={
              <ProtectedRoute allowedRole="college">
                <CollegeReports />
              </ProtectedRoute>
            } />
            <Route path="/college/profile" element={
              <ProtectedRoute allowedRole="college">
                <CollegeProfile />
              </ProtectedRoute>
            } />
            <Route path="/company/dashboard" element={
              <ProtectedRoute allowedRole="company">
                <CompanyDashboard />
              </ProtectedRoute>
            } />
            <Route path="/company/post-job" element={
              <ProtectedRoute allowedRole="company">
                <CompanyPostJob />
              </ProtectedRoute>
            } />
            <Route path="/company/applications" element={
              <ProtectedRoute allowedRole="company">
                <CompanyApplications />
              </ProtectedRoute>
            } />
            <Route path="/company/shortlisted" element={
              <ProtectedRoute allowedRole="company">
                <CompanyShortlisted />
              </ProtectedRoute>
            } />
            <Route path="/company/profile" element={
              <ProtectedRoute allowedRole="company">
                <CompanyProfile />
              </ProtectedRoute>
            } />
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/companies" element={
              <ProtectedRoute allowedRole="student">
                <StudentCompanies />
              </ProtectedRoute>
            } />
            <Route path="/student/applications" element={
              <ProtectedRoute allowedRole="student">
                <StudentApplications />
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute allowedRole="student">
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
