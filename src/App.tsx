import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SendDeviceOrigin from "./pages/SendDeviceOrigin";
import ReceiveDeviceOrigin from "./pages/ReceiveDeviceOrigin";
import SendDeviceDestination from "./pages/SendDeviceDestination";
import ReceiveDeviceDestination from "./pages/ReceiveDeviceDestination";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sendOrigin" element={<SendDeviceOrigin />} />
          <Route path="/sendDestination" element={<SendDeviceDestination />} />
          <Route path="/receiveOrigin" element={<ReceiveDeviceOrigin />} />
          <Route path="/receiveDestination" element={<ReceiveDeviceDestination />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;