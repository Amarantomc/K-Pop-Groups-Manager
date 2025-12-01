import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import { useAuth } from '../../contexts/auth/AuthContext';
import './PageLayout.css';

interface PageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  description, 
  children, 
  className = '' 
}) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`page-layout ${className}`}>
      <Sidebar collapsed={collapsed} role={user?.role || 'admin'} />
      <div className="page-content">
        <Header 
          title={title} 
          description={description} 
          showlogo={false} 
          collapsed={collapsed} 
          setCollapsed={setCollapsed}
        />
        <div className="page-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
