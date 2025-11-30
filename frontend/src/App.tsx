// Ubicación: src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './contexts/routes/AppRouter';
import { AuthProvider } from './contextsLocal/AuthContext';
import './App.css';

// DebugAuth removed

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