/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatCard from '../../components/statCard/StatCard';
import ChartComponent from '../../components/chartComponent/ChartComponent';
import PageLayout from '../../components/pageLayout/PageLayout';
import './exampleUsage.css';

const ExampleUsage: React.FC = () => {
  // ============================================
  // EJEMPLO 1: StatCards (Métricas rápidas)
  // ============================================
  const renderStatsSection = () => (
    <div className="stats-section">
      <h2>📊 Ejemplo 1: StatCards (Métricas Rápidas)</h2>
      <div className="stat-cards-grid">
        <StatCard
          title="Artistas Activos"
          value={120}
          icon={<PeopleIcon />}
          trend={{ value: 15, direction: 'up' }}
          color="#10b981"
          subtitle="vs mes anterior"
        />
        <StatCard
          title="Ingresos Totales"
          value={150000}
          icon={<AttachMoneyIcon />}
          trend={{ value: 8, direction: 'up' }}
          color="#7451f8"
          prefix="$"
          subtitle="último mes"
        />
        <StatCard
          title="Álbumes Vendidos"
          value={3500}
          icon={<TrendingUpIcon />}
          trend={{ value: 3, direction: 'down' }}
          color="#3b82f6"
          subtitle="este trimestre"
        />
      </div>
    </div>
  );

  // ============================================
  // EJEMPLO 2: Todos los tipos de Gráficos (BarChart, LineChart, PieChart)
  // ============================================
  const renderChartsSection = () => {
    // Datos de ejemplo 1: Artistas por Agencia (Barras)
    const artistsByAgency = [
      { agencyName: 'SM Entertainment', artistCount: 45 },
      { agencyName: 'YG Entertainment', artistCount: 32 },
      { agencyName: 'JYP Entertainment', artistCount: 28 },
      { agencyName: 'HYBE', artistCount: 38 },
      { agencyName: 'Pledis', artistCount: 22 }
    ];

    // Datos de ejemplo 2: Ventas de álbumes (Barras con otro color)
    const albumSales = [
      { albumName: 'Hot Sauce', sales: 2500000 },
      { albumName: 'Sticker', sales: 2100000 },
      { albumName: 'Favorite', sales: 1800000 },
      { albumName: 'Glitch Mode', sales: 1500000 },
      { albumName: 'Beatbox', sales: 1200000 }
    ];

    // Datos de ejemplo 3: Evolución de Ingresos Mensuales (Líneas)
    const incomeByMonth = [
      { month: 'Enero', amount: 50000 },
      { month: 'Febrero', amount: 65000 },
      { month: 'Marzo', amount: 75000 },
      { month: 'Abril', amount: 70000 },
      { month: 'Mayo', amount: 85000 },
      { month: 'Junio', amount: 95000 },
      { month: 'Julio', amount: 110000 },
      { month: 'Agosto', amount: 105000 }
    ];

    // Datos de ejemplo 4: Crecimiento de Seguidores (Líneas)
    const followersGrowth = [
      { week: 'Semana 1', followers: 100000 },
      { week: 'Semana 2', followers: 125000 },
      { week: 'Semana 3', followers: 140000 },
      { week: 'Semana 4', followers: 180000 },
      { week: 'Semana 5', followers: 210000 },
      { week: 'Semana 6', followers: 250000 }
    ];

    // Datos de ejemplo 5: Distribución por Estado (Torta)
    const artistsByStatus = [
      { status: 'Activo', count: 120 },
      { status: 'Inactivo', count: 30 },
      { status: 'En Gira', count: 15 },
      { status: 'En Formación', count: 25 }
    ];

    // Datos de ejemplo 6: Distribución de Ingresos por Fuente (Torta)
    const incomeBySource = [
      { source: 'Álbumes', amount: 450000 },
      { source: 'Conciertos', amount: 380000 },
      { source: 'Merchandising', amount: 220000 },
      { source: 'Streaming', amount: 150000 },
      { source: 'Publicidad', amount: 100000 }
    ];

    return (
      <div className="charts-section">
        <h2>📈 Ejemplo 2: Todos los Tipos de Gráficos</h2>

        {/* Gráficos de Barras */}
        <div className="chart-subsection">
          <h3 style={{ fontSize: '18px', color: '#374151', marginBottom: '16px' }}>
            🔵 Gráficos de Barras (BarChart)
          </h3>
          <div className="charts-grid">
            <ChartComponent.Bar
              data={artistsByAgency}
              xKey="agencyName"
              yKey="artistCount"
              title="Artistas por Agencia"
              color="#7451f8"
            />

            <ChartComponent.Bar
              data={albumSales}
              xKey="albumName"
              yKey="sales"
              title="Ventas de Álbumes (unidades)"
              color="#ef4444"
            />
          </div>
        </div>

        {/* Gráficos de Líneas */}
        <div className="chart-subsection">
          <h3 style={{ fontSize: '18px', color: '#374151', marginBottom: '16px' }}>
            📊 Gráficos de Líneas (LineChart)
          </h3>
          <div className="charts-grid">
            <ChartComponent.Line
              data={incomeByMonth}
              xKey="month"
              yKey="amount"
              title="Evolución de Ingresos Mensuales ($)"
              color="#10b981"
            />

            <ChartComponent.Line
              data={followersGrowth}
              xKey="week"
              yKey="followers"
              title="Crecimiento de Seguidores en Redes"
              color="#3b82f6"
            />
          </div>
        </div>

        {/* Gráficos de Torta */}
        <div className="chart-subsection">
          <h3 style={{ fontSize: '18px', color: '#374151', marginBottom: '16px' }}>
            🥧 Gráficos de Torta (PieChart)
          </h3>
          <div className="charts-grid">
            <ChartComponent.Pie
              data={artistsByStatus}
              labelKey="status"
              valueKey="count"
              title="Distribución de Artistas por Estado"
            />

            <ChartComponent.Pie
              data={incomeBySource}
              labelKey="source"
              valueKey="amount"
              title="Distribución de Ingresos por Fuente ($)"
              colors={['#7451f8', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
            />
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // EJEMPLO 3: Combinación de StatCards + Gráfico
  // ============================================
  const renderCombinedExample = () => {
    // Datos de eventos/conciertos
    const concertData = [
      { month: 'Ene', concerts: 8, revenue: 120000 },
      { month: 'Feb', concerts: 10, revenue: 150000 },
      { month: 'Mar', concerts: 12, revenue: 180000 },
      { month: 'Abr', concerts: 9, revenue: 135000 },
      { month: 'May', concerts: 15, revenue: 225000 },
      { month: 'Jun', concerts: 18, revenue: 270000 }
    ];

    const totalConcerts = concertData.reduce((sum, item) => sum + item.concerts, 0);
    const totalRevenue = concertData.reduce((sum, item) => sum + item.revenue, 0);
    const avgRevenue = Math.round(totalRevenue / concertData.length);

    return (
      <div className="combined-section">
        <h2>🎯 Ejemplo 3: StatCards + Gráfico Combinados</h2>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Ejemplo de cómo combinar métricas y visualización en un dashboard
        </p>

        {/* Métricas calculadas */}
        <div className="stat-cards-grid">
          <StatCard
            title="Total Conciertos"
            value={totalConcerts}
            icon={<TrendingUpIcon />}
            color="#8b5cf6"
            subtitle="últimos 6 meses"
          />
          <StatCard
            title="Ingresos Totales"
            value={totalRevenue}
            icon={<AttachMoneyIcon />}
            color="#10b981"
            prefix="$"
            suffix=""
          />
          <StatCard
            title="Ingreso Promedio"
            value={avgRevenue}
            icon={<AttachMoneyIcon />}
            color="#3b82f6"
            prefix="$"
            subtitle="por mes"
          />
        </div>

        {/* Gráfico detallado */}
        <div style={{ marginTop: '24px' }}>
          <ChartComponent.Bar
            data={concertData}
            xKey="month"
            yKey="concerts"
            title="Número de Conciertos por Mes"
            color="#8b5cf6"
            height={350}
          />
        </div>
      </div>
    );
  };

  // ============================================
  // EJEMPLO 4: Múltiples Gráficos en Grid Comparativo
  // ============================================
  const renderComparativeCharts = () => {
    // Comparación trimestral
    const quarterlyComparison = [
      { quarter: 'Q1 2024', albums: 5, singles: 12, concerts: 25 },
      { quarter: 'Q2 2024', albums: 7, singles: 15, concerts: 30 },
      { quarter: 'Q3 2024', albums: 6, singles: 10, concerts: 28 },
      { quarter: 'Q4 2024', albums: 8, singles: 18, concerts: 35 }
    ];

    // Engagement en redes sociales
    const socialMedia = [
      { platform: 'YouTube', subscribers: 5200000 },
      { platform: 'Instagram', subscribers: 4800000 },
      { platform: 'Twitter', subscribers: 3500000 },
      { platform: 'TikTok', subscribers: 6100000 },
      { platform: 'Weibo', subscribers: 2900000 }
    ];

    // Distribución de géneros musicales
    const musicGenres = [
      { genre: 'K-Pop', tracks: 85 },
      { genre: 'Hip-Hop', tracks: 42 },
      { genre: 'R&B', tracks: 28 },
      { genre: 'Ballad', tracks: 35 },
      { genre: 'EDM', tracks: 20 }
    ];

    return (
      <div className="comparative-section">
        <h2>🎨 Ejemplo 4: Dashboard Completo con Múltiples Gráficos</h2>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Ejemplo de dashboard profesional con varios tipos de visualizaciones
        </p>

        <div className="charts-grid">
          <ChartComponent.Line
            data={quarterlyComparison}
            xKey="quarter"
            yKey="albums"
            title="Lanzamientos de Álbumes por Trimestre"
            color="#ef4444"
          />

          <ChartComponent.Bar
            data={socialMedia}
            xKey="platform"
            yKey="subscribers"
            title="Seguidores por Plataforma Social"
            color="#f59e0b"
          />

          <ChartComponent.Pie
            data={musicGenres}
            labelKey="genre"
            valueKey="tracks"
            title="Distribución de Canciones por Género"
            colors={['#7451f8', '#ec4899', '#10b981', '#3b82f6', '#f59e0b']}
          />
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      title="Guía de Uso: Componentes de Reportes"
      description="Ejemplos prácticos de StatCard, ChartComponent y QueryCard"
    >
      <div className="example-usage-content">
        {renderStatsSection()}
        {renderChartsSection()}
        {renderCombinedExample()}
        {renderComparativeCharts()}
      </div>
    </PageLayout>
  );
};

export default ExampleUsage;
