import React, { useState } from 'react';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import './scout.css';
import { Button, Box} from '@mui/material';
import ModalCreate from '../../components/modal/ModalCreate';
import { contractFields } from '../../config/formSource';

// Simulación de datos para aprendices y artistas
const aprendicesEnProceso = [
  { id: 1, nombre: 'Juan Pérez', estado: 'En proceso de selección', edad: 20 },
  { id: 2, nombre: 'Ana Gómez', estado: 'En proceso de selección', edad: 22 },
];

const artistasEnPausa = [
  { id: 1, nombre: 'Kim Minji', estado: 'Pausa', genero: 'Pop' },
  { id: 2, nombre: 'Lee Jisoo', estado: 'Pausa', genero: 'R&B' },
];

const columnsAprendices = [
  { field: 'nombre', headerName: 'Nombre', flex: 1 },
  { field: 'edad', headerName: 'Edad', flex: 1 },
  { field: 'estado', headerName: 'Estado', flex: 1 },
  {
    field: 'accion',
    headerName: 'Acción',
    flex: 1,
    renderCell: (params: any) => (
      <Button variant="contained" color="primary" onClick={() => alert(`Captar aprendiz: ${params.row.nombre}`)}>
        Captar
      </Button>
    ),
  },
];

const columnsArtistas = [
  { field: 'nombre', headerName: 'Nombre', flex: 1 },
  { field: 'genero', headerName: 'Género', flex: 1 },
  { field: 'estado', headerName: 'Estado', flex: 1 },
  {
    field: 'accion',
    headerName: 'Acción',
    flex: 1,
    renderCell: (params: any) => (
      <Button variant="contained" color="success" onClick={() => alert(``)}>
        Ofrecer Contrato
      </Button>
    ),
  },
];

const Scout : React.FC = () => {

  const columnsAprendices = [
  { field: 'nombre', headerName: 'Nombre', flex: 1 },
  { field: 'edad', headerName: 'Edad', flex: 1 },
  { field: 'estado', headerName: 'Estado', flex: 1 },
  {
    field: 'accion',
    headerName: 'Acción',
    flex: 1,
    renderCell: (params: any) => (
      <Button variant="contained" color="primary" onClick={() => alert(`Captar aprendiz: ${params.row.nombre}`)}>
        Captar
      </Button>
    ),
  },
];

const columnsArtistas = [
  { field: 'nombre', headerName: 'Nombre', flex: 1 },
  { field: 'genero', headerName: 'Género', flex: 1 },
  { field: 'estado', headerName: 'Estado', flex: 1 },
  {
    field: 'accion',
    headerName: 'Acción',
    flex: 1,
    renderCell: (params: any) => (
      <Button variant="contained" color="success" onClick={() => setShowContractModal(true)}>
        Ofrecer Contrato
      </Button>
    ),
  },
];
  const [vista, setVista] = useState<'aprendices' | 'artistas'>('aprendices');
  const [showContractModal,setShowContractModal] = useState(false)

  return (
    <PageLayout
      title="Gestión de Talento"
      description="Capta aprendices en proceso de selección u ofrece contratos a artistas en pausa."
      className="manager-pagelayout"
    >
      <Box className="manager-container">
        <Box className="manager-actions" sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button
            variant={vista === 'aprendices' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setVista('aprendices')}
          >
            Captar Aprendices
          </Button>
          <Button
            variant={vista === 'artistas' ? 'contained' : 'outlined'}
            color="success"
            onClick={() => setVista('artistas')}
          >
            Ofrecer Contratos a Artistas
          </Button>
        </Box>
        {vista === 'aprendices' ? (
          <DataTable columns={columnsAprendices} rows={aprendicesEnProceso} pagesize={5} showCreateButton={false} />
        ) : (
          <DataTable columns={columnsArtistas} rows={artistasEnPausa} pagesize={5} showCreateButton={false} />
        )}
        {/* Modal para campos del contrato */}
        <ModalCreate
        isOpen={showContractModal}
        title="Contrato"
        createFields={contractFields}
         onSave={() => setShowContractModal(false)}
         onClose={() => setShowContractModal(false)}
        />
      </Box>
    </PageLayout>
  );
};

export default Scout;
