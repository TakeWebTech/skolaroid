import { BrowserRouter } from "react-router";
import { AppProvider } from "./store/app-context";
import { AppRouter } from "./router";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRouter />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AppProvider>
  );
}
