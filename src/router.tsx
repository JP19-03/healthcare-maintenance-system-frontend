import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/auth/LoginView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
      </Routes>
    </BrowserRouter>
  );
}
