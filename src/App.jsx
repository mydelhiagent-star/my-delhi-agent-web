import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchByLocation from "./pages/SearchByLocation";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search-location" element={<SearchByLocation />} />
      </Routes>
    </Router>
  );
}

export default App;
