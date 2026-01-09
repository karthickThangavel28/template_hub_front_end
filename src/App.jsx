import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DeploymentStatus from "./pages/DeploymentStatus";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import AuthSuccess from "./components/AuthSuccess";
import ConfigureStepper from "./pages/Configure";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />

          {/* Protected */}
          <Route
            path="/configure/:id"  
            element={
              <ProtectedRoute>
                <ConfigureStepper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deploy/:id"
            element={
              <ProtectedRoute>
                <DeploymentStatus />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/success" element={<AuthSuccess />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
