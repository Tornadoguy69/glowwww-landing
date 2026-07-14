import { Routes, Route } from 'react-router-dom'
import { LaunchHome } from './launch/LaunchHome'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LaunchHome />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
    </Routes>
  )
}
