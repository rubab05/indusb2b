import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "../contexts/AuthContext";
import { BrandProvider } from "../contexts/BrandContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <BrandProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </BrandProvider>
  );
}
