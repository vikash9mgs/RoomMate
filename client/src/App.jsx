import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import HomePage from "./HomePage";
import NavbarComponent from "./components/NavbarComponent";
import ContactUs from "./pages/ContactUs";
import TermsOfuse from "./pages/TermsOfuse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Refund from "./pages/Refund";
import PostListing from "./pages/PostListing";
import ProtectedRoute from "./components/ProtectedRoute";
import AllListingPage from "./pages/AllListingPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ListingDetailsPage from "./pages/ListingDetailsPage";
import PaymentPage from "./pages/PaymentPage";
import AboutUs from "./pages/AboutUs"; // ✅ Import AboutUs
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ Import ThemeProvider
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/navbar" element={<NavbarComponent />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/testimonial" element={<Testimonials />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/termsofuse" element={<TermsOfuse />} />
            <Route path="/privacy&policy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/about" element={<AboutUs />} /> {/* ✅ New About Us Route */}

            {/* Displays the list of all property cards/listings */}
            <Route path="/all-listings" element={<AllListingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Displays individual listing details */}
            <Route path="/listing/:id" element={<ListingDetailsPage />} />
            <Route path="/payment/:id" element={<PaymentPage />} />

            {/* Protected Page: Starting point for creating a new listing (room type selection) */}
            <Route
              path="/postlisting"
              element={
                <ProtectedRoute allowedRoles={['user', 'member', 'admin']}>
                  <PostListing />
                </ProtectedRoute>
              }
            />

            {/* Protected Page: The actual form for creating the listing */}
            <Route
              path="/listing-details/:id"
              element={
                <ProtectedRoute allowedRoles={['user', 'member', 'admin']}>
                  <PostListing />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Chatbot />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;