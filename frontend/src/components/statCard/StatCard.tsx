import React from 'react';
import './statCard.css';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = '#7451f8',
  subtitle,
  prefix = '',
  suffix = ''
}) => {
  const formatValue = () => {
    if (typeof value === 'number') {
      return `${prefix}${value.toLocaleString('es-ES')}${suffix}`;
    }
    return `${prefix}${value}${suffix}`;
  };

  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-card-header">
        {icon && <span className="stat-card-icon" style={{ color }}>{icon}</span>}
        {trend && (
          <span className={`stat-card-trend ${trend.direction}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className="stat-card-value">{formatValue()}</div>
      <div className="stat-card-label">{title}</div>
      {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
    </div>
  );
};

export default StatCard;
