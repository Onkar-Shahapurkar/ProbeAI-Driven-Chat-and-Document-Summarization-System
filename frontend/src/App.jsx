import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Documents from "./pages/Documents";
import Video from "./pages/Video";
import Analytics from "./pages/Analytics";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route 
            path="/chat" 
            element={<Chat />} 
          />

          <Route
            path="/chat/:conversationId"
            element={<Chat />}
          />

          <Route
            path="/documents"
            element={<Documents />}
          />

          <Route
            path="/video"
            element={<Video />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />
        </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;