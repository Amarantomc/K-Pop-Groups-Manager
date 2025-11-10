// Ubicación: src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import AppRouter from './components/common/AppRouter';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRouter />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;