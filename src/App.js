import "./App.css";
import AppContext from "./components/AppContext/AppContext";
import Pages from "./components/Pages/Pages";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContext>
          <Pages />
        </AppContext>
      </BrowserRouter>
    </div>
  );
}

export default App;
