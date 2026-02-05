import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// GitHub Pages redirect support
const p = new URLSearchParams(location.search).get("p");
if (p) {
  history.replaceState(null, "", p);
}


createRoot(document.getElementById("root")!).render(<App />);
