import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import TrendingFeed from './pages/TrendingFeed';
import ContentEditor from './pages/ContentEditor';
import PostQueue from './pages/PostQueue';
import Analytics from './pages/Analytics';
import './index.css';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedContent, setSelectedContent] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'info' }), 4000);
  }, []);

  const handleRemix = useCallback((content) => {
    setSelectedContent(content);
    setActivePage('editor');
    showToast('Contenu chargé dans l\'éditeur ✨', 'info');
  }, [showToast]);

  function renderPage() {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} onRemix={handleRemix} />;
      case 'trending':
        return <TrendingFeed onRemix={handleRemix} />;
      case 'editor':
        return <ContentEditor selectedContent={selectedContent} onToast={showToast} />;
      case 'queue':
        return <PostQueue onToast={showToast} />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard onNavigate={setActivePage} onRemix={handleRemix} />;
    }
  }

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}
