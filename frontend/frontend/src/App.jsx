import { Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Demo from "./pages/demo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/demo" element={<Demo />} />
    </Routes>
  );
}

export default App;