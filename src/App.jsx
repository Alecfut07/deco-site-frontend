import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/admin/Dashboard";
import PortfolioItems from "@/pages/admin/PortfolioItems";
import PortfolioItemForm from "@/pages/admin/PortfolioItemForm";
import PortfolioItemMedia from "@/pages/admin/PortfolioItemMedia";
import Categories from "@/pages/admin/Categories";
import Services from "@/pages/admin/Services";
import BusinessInfo from "@/pages/admin/BusinessInfo";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="portfolio" element={<PortfolioItems />} />
            <Route path="portfolio/new" element={<PortfolioItemForm />} />
            <Route path="portfolio/:id" element={<PortfolioItemForm />} />
            <Route
              path="portfolio/:id/media"
              element={<PortfolioItemMedia />}
            />
            <Route path="categories" element={<Categories />} />
            <Route path="services" element={<Services />} />
            <Route path="business" element={<BusinessInfo />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
