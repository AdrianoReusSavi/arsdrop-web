import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ConnectionProvider } from "./contexts/ConnectionContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ConnectionProvider>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </ConnectionProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;