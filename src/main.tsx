
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { brandConfig } from "./config/brand.config.ts";

  document.title = brandConfig.brandName;

  createRoot(document.getElementById("root")!).render(<App />);
  