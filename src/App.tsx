import { Route, Routes } from "react-router-dom";
import { HomePage } from "./components/home/HomePage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { GoalPage } from "./pages/GoalPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/goal" element={<GoalPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
