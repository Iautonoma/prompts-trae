import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import PromptDetail from './pages/PromptDetail';
import SubmitPrompt from './pages/SubmitPrompt';
import SearchPage from './pages/SearchPage';
import FormPage from './pages/FormPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/prompt/:id" element={<PromptDetail />} />
          <Route path="/submit" element={<SubmitPrompt />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
