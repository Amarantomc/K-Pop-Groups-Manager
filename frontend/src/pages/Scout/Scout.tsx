/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useEffect, useState } from 'react';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import './scout.css';
import { Button, Box} from '@mui/material';
import ModalCreate from '../../components/modal/ModalCreate';
import { contractFields } from '../../config/formSource';

const artistasEnPausa = [
  { id: 1, nombre: 'Kim Minji', estado: 'Pausa', genero: 'Pop' },
  { id: 2, nombre: 'Lee Jisoo', estado: 'Pausa', genero: 'R&B' },
];

const Scout : React.FC = () => {

  const columnsAprendices = [
    { field: 'name', headerName: 'Nombre Completo', width: 150 },
    { field: 'dateOfBirth', headerName: 'Fecha de Nacimiento', width: 250 },
    { field: 'age', headerName: 'Edad', width: 90 },
    { field: 'trainingLv', headerName: 'Nivel de Entrenamiento', width: 180 },
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
   { field: 'ArtistName', headerName: 'Nombre Artístico', width: 200 },
    {field: 'DebutDate',headerName: 'Fecha Debut',width: 150},
    {field: 'Status',headerName: 'Estado',width:120},
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
  const [apprenticeScoutRows,setApprenticeScoutRows] = useState<any[]>([])
  const [artistsScoutRows,setArtistsScoutRows] = useState<any[]>([]) 

  useEffect(
                  () => {
                      const fetchScout = async () => {
                          try{
                              const token = localStorage.getItem('token')
                            const response = await fetch('http://localhost:3000/api/apprentice/scout', {
                                      headers: {
                                                  'Authorization': `Bearer ${token}`,
                                                  'Content-Type': 'application/json'
                                                }
                                  });
                              if(!response.ok){
                                  throw new Error("Error al obtener los aprendices")
                              }
                              const data = await response.json()
                              console.log(data)
                              const formattedData = data.data.map((apprentice : any , index : number) => ({
                                  id : apprentice.id?? index,
                                  name : apprentice.name,
                                  age : apprentice.age,
                                  dateOfBirth : apprentice.dateOfBirth,
                                  trainingLv : apprentice.trainingLv
                              }))
                              setApprenticeScoutRows(formattedData)

                              const artist_response = await fetch('http://localhost:3000/api/contract/offer', {
                                      headers: {
                                                  'Authorization': `Bearer ${token}`,
                                                  'Content-Type': 'application/json'
                                                }
                                  });
                              if(!artist_response.ok){
                                  throw new Error("Error al obtener los artistas")
                              }
                              const artist_data = await artist_response.json()
                              console.log(artist_data)
                              const formattedArtistData = artist_data.data.map((artist: any) => ({
                                id: `${artist.ApprenticeId}:${artist.GroupId}`,
                                ArtistName: artist.ArtistName,
                                DebutDate: artist.DebutDate,
                                Status: artist.Status,
                                ApprenticeId: artist.ApprenticeId,
                                GroupId: artist.GroupId,
                              }));
                              setArtistsScoutRows(formattedArtistData)
                          }
                          catch(error){
                              console.error(error)
                          }
                      }
                      fetchScout()
                  },[]
              )

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
          <DataTable columns={columnsAprendices} rows={apprenticeScoutRows} pagesize={5} showCreateButton={false} />
        ) : (
          <DataTable columns={columnsArtistas} rows={artistsScoutRows} pagesize={5} showCreateButton={false} />
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