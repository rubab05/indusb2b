import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "../contexts/AuthContext";
import { BrandProvider } from "../contexts/BrandContext";

export default function App() {
  return (
    <BrandProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </BrandProvider>
  );
}
