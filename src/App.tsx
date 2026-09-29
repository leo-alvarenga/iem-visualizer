import { Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { AboutPage } from "@/pages/AboutPage";
import { ComparePage } from "@/pages/ComparePage";
import { LibraryPage } from "@/pages/LibraryPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ComparePage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
