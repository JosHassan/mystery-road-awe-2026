import { createRoot } from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("react-root");
if (!container) throw new Error("Missing React root element");

createRoot(container).render(<App />);
