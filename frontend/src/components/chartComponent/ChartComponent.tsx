/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './chartComponent.css';

interface BaseChartProps {
  data: any[];
  title?: string;
  height?: number;
}

interface BarChartProps extends BaseChartProps {
  xKey: string;
  yKey: string;
  color?: string;
}

interface LineChartProps extends BaseChartProps {
  xKey: string;
  yKey: string;
  color?: string;
}

interface PieChartProps extends BaseChartProps {
  labelKey: string;
  valueKey: string;
  colors?: string[];
}

// Colores por defecto
const DEFAULT_COLORS = [
  '#7451f8',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6'
];

// ============================================
// BAR CHART (Gráfico de Barras)
// ============================================
export const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  color = '#7451f8',
  title,
  height = 300
}) => {
  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey={xKey} 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Bar 
            dataKey={yKey} 
            fill={color}
            radius={[8, 8, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ============================================
// LINE CHART (Gráfico de Líneas)
// ============================================
export const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  color = '#7451f8',
  title,
  height = 300
}) => {
  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey={xKey} 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, r: 5 }}
            activeDot={{ r: 7 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ============================================
// PIE CHART (Gráfico de Torta)
// ============================================
export const PieChart: React.FC<PieChartProps> = ({
  data,
  labelKey,
  valueKey,
  colors = DEFAULT_COLORS,
  title,
  height = 300
}) => {
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 600 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={labelKey}
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie> 
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Exportar componente unificado para facilitar el uso
const ChartComponent = {
  Bar: BarChart,
  Line: LineChart,
  Pie: PieChart
};

export default ChartComponent;
