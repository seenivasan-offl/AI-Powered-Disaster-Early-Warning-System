import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AlertDashboard from "./components/AlertDashboard";
import AddAlert from "./components/AddAlertForm";
import IncidentReport from "./components/IncidentReportForm";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import Signup from "./components/Signup";
import WeatherSearch from "./components/WeatherSearch";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import "./App.css";
import HistoricalPredictionView from "./components/HistoricalPredictionView";
import AIExperiment from "./components/AIExperiment";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute><AlertDashboard /></PrivateRoute>} />
        <Route path="/add-alert" element={<PrivateRoute><AddAlert /></PrivateRoute>} />
        <Route path="/report-incident" element={<PrivateRoute><IncidentReport /></PrivateRoute>} />
        <Route path="/weather" element={<PrivateRoute><WeatherSearch location="Chennai" /></PrivateRoute>} />
        <Route path="/historical-predictions" element={<HistoricalPredictionView />} />
        <Route path="/ai-demo" element={<PrivateRoute><AIExperiment /></PrivateRoute>} />
        {/* Admin-only route */}
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
