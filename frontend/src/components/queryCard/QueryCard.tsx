/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './queryCard.css';

interface FilterOption {
  value: string | number;
  label: string;
}

interface Filter {
  name: string;
  type: 'select' | 'text' | 'number' | 'date' | 'dateRange';
  label: string;
  options?: FilterOption[];
  placeholder?: string;
  min?: number;
  max?: number;
}

interface QueryCardProps {
  title: string;
  endpoint: string;
  filters?: Filter[];
  renderData: (data: any) => React.ReactNode;
  autoFetch?: boolean;
  onDataLoaded?: (data: any) => void;
  emptyMessage?: string;
}

const QueryCard: React.FC<QueryCardProps> = ({
  title,
  endpoint,
  filters = [],
  renderData,
  autoFetch = true,
  onDataLoaded,
  emptyMessage = 'No hay datos disponibles'
}) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Construir query params desde los filtros
      const queryParams = new URLSearchParams();
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      const url = `http://localhost:3000${endpoint}${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const fetchedData = result.data || result;
      
      setData(fetchedData);
      
      if (onDataLoaded) {
        onDataLoaded(fetchedData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, autoFetch]);

  const handleFilterChange = (filterName: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleClearFilters = () => {
    setFilterValues({});
    // Re-fetch con filtros vacíos después de limpiar
    setTimeout(fetchData, 100);
  };

  const renderFilter = (filter: Filter) => {
    const value = filterValues[filter.name] || '';

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.name} className="query-card-filter-item">
            <label>{filter.label}</label>
            <select
              value={value}
              onChange={(e) => handleFilterChange(filter.name, e.target.value)}
            >
              <option value="">Todos</option>
              {filter.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'text':
        return (
          <div key={filter.name} className="query-card-filter-item">
            <label>{filter.label}</label>
            <input
              type="text"
              value={value}
              placeholder={filter.placeholder || `Buscar ${filter.label.toLowerCase()}`}
              onChange={(e) => handleFilterChange(filter.name, e.target.value)}
            />
          </div>
        );

      case 'number':
        return (
          <div key={filter.name} className="query-card-filter-item">
            <label>{filter.label}</label>
            <input
              type="number"
              value={value}
              min={filter.min}
              max={filter.max}
              placeholder={filter.placeholder}
              onChange={(e) => handleFilterChange(filter.name, e.target.value)}
            />
          </div>
        );

      case 'date':
        return (
          <div key={filter.name} className="query-card-filter-item">
            <label>{filter.label}</label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleFilterChange(filter.name, e.target.value)}
            />
          </div>
        );

      case 'dateRange':
        return (
          <div key={filter.name} className="query-card-filter-item date-range">
            <label>{filter.label}</label>
            <div className="date-range-inputs">
              <input
                type="date"
                value={filterValues[`${filter.name}_start`] || ''}
                placeholder="Desde"
                onChange={(e) =>
                  handleFilterChange(`${filter.name}_start`, e.target.value)
                }
              />
              <span>-</span>
              <input
                type="date"
                value={filterValues[`${filter.name}_end`] || ''}
                placeholder="Hasta"
                onChange={(e) =>
                  handleFilterChange(`${filter.name}_end`, e.target.value)
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="query-card">
      <div className="query-card-header">
        <h3 className="query-card-title">{title}</h3>
      </div>

      {filters.length > 0 && (
        <div className="query-card-filters">
          <div className="query-card-filters-grid">
            {filters.map(renderFilter)}
          </div>
          <div className="query-card-filters-actions">
            <button className="btn-secondary" onClick={handleClearFilters}>
              Limpiar
            </button>
            <button className="btn-primary" onClick={handleApplyFilters}>
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      <div className="query-card-content">
        {isLoading && (
          <div className="query-card-loading">
            <CircularProgress size={40} style={{ color: '#7451f8' }} />
            <p>Cargando datos...</p>
          </div>
        )}

        {error && (
          <div className="query-card-error">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button className="btn-primary" onClick={fetchData}>
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            {Array.isArray(data) && data.length === 0 ? (
              <div className="query-card-empty">
                <span className="empty-icon">📭</span>
                <p>{emptyMessage}</p>
              </div>
            ) : (
              renderData(data)
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QueryCard;
