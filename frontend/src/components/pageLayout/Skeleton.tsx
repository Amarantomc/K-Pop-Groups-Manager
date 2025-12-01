import React from 'react';
import PageLayout from '../../components/pageLayout/PageLayout';

/**
 * Componente Skeleton - Plantilla base para crear nuevas páginas
 * 
 * USO:
 * 1. Copia este archivo y renómbralo según tu página
 * 2. Cambia el title y description
 * 3. Agrega tu contenido dentro de <PageLayout>
 * 
 * EJEMPLO:
 * <PageLayout title="Mi Página" description="Descripción de mi página">
 *   <div>
 *     Tu contenido aquí
 *   </div>
 * </PageLayout>
 */

const Skeleton: React.FC = () => {
  return (
    <PageLayout 
      title="Título de la Página" 
      description="Descripción de lo que hace esta página"
    >
      {/* Aquí va el contenido de tu página */}
      <div style={{ padding: '20px' }}>
        <h2>Contenido de la página</h2>
        <p>Reemplaza este contenido con el tuyo.</p>
      </div>
    </PageLayout>
  );
};

export default Skeleton;
