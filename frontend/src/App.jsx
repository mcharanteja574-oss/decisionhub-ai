import { HashRouter, Route, Routes } from "react-router-dom";
import Architecture from "./pages/Architecture.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/architecture" element={<Architecture />} />
      </Routes>
    </HashRouter>
  );
}
