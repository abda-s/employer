import { BrowserRouter } from "react-router-dom";
import RoutesRender from "./components/RoutesRender";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <RoutesRender />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
