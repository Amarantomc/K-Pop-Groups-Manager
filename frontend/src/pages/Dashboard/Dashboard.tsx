/* eslint-disable @typescript-eslint/no-explicit-any */ 
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import "./Dashboard.css"
import Header from '../../components/header/Header';
import { useAuth } from '../../contextsLocal/AuthContext';


const Dashboard : React.FC = () =>{
  const [agenciesCount, setAgenciesCount] = useState<number | null>(null);
  const [apprenticesCount, setApprenticesCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);

  useEffect(() => {
    const API_BASE = 'http://localhost:3000';

    const fetchCount = async (url: string) => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;
        const res = await fetch(url, { headers });

        if (!res.ok) {
          if (import.meta.env.MODE === 'development') {
            const txt = await res.text().catch(() => '');
            // eslint-disable-next-line no-console
            console.debug('[Dashboard] fetchCount non-ok', url, res.status, res.statusText, txt);
          }
          return null;
        }

        const data = await res.json().catch(() => null);

        // Casos comunes que puede devolver el backend
        // - una lista (array)
        if (Array.isArray(data)) return data.length;

        // - objeto con clave 'data' que contiene lista
        if (data && typeof data === 'object') {
          if (Array.isArray((data as any).data)) return (data as any).data.length;
          if (typeof (data as any).total === 'number') return (data as any).total;
          if (typeof (data as any).count === 'number') return (data as any).count;
          if (typeof (data as any).length === 'number') return (data as any).length;
          // algunos endpoints devuelven { meta: { total: X } }
          if ((data as any).meta && typeof (data as any).meta.total === 'number') return (data as any).meta.total;
        }

        // Si no logramos inferir nada, devolver null
        if (import.meta.env.MODE === 'development') {
          // eslint-disable-next-line no-console
          console.debug('[Dashboard] fetchCount unknown response shape', url, data);
        }
        return null;
      } catch (e) {
        if (import.meta.env.MODE === 'development') console.debug('[Dashboard] fetchCount error', url, e);
        return null;
      }
    };

    (async () => {
      const [a, p, u] = await Promise.all([
        fetchCount(`${API_BASE}/api/agency/`),
        fetchCount(`${API_BASE}/api/apprentice/`),
        fetchCount(`${API_BASE}/api/user/`),
      ]);
      setAgenciesCount(a);
      setApprenticesCount(p);
      setUsersCount(u);
    })();
  }, []);

  const renderValue = (v: number | null) => v == null ? '—' : String(v);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  return (
    <div className='dashboard-sidebar'>
      <Sidebar collapsed={collapsed} role={user?.role || 'admin'}/>
      <div className='dashboard-navbar'>
        <div className='dashboard-content'>
          <Header title='Bienvenido a Gestión de Agencias del K-Pop' 
          description='Administra agencias, artistas y actividades desde este panel. Aquí tienes un resumen rápido para comenzar.'
          collapsed={collapsed} 
          setCollapsed={setCollapsed}/>

          <div className='quick-stats'>
            <div className='stat'>
              <div className='stat-value'>{renderValue(agenciesCount)}</div>
              <div className='stat-label'>Agencias</div>
            </div>
            <div className='stat'>
              <div className='stat-value'>{renderValue(apprenticesCount)}</div>
              <div className='stat-label'>Aprendices</div>
            </div>
            <div className='stat'>
              <div className='stat-value'>{renderValue(usersCount)}</div>
              <div className='stat-label'>Usuarios</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;