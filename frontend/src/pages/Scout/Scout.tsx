/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import './scout.css';
import { Button, Box } from '@mui/material';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import ModalCreate from '../../components/modal/ModalCreate';
import { contractFields } from '../../config/formSource';

const Scout: React.FC = () => {
  const { user } = useAuth();

  // ConfirmDialog states
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAttract = async (apprenticeId: number) => {
    if (!user) {
      setErrorMessage('Usuario no autenticado');
      setOpenError(true);
      return;
    }
    const agencyId = user.profileData?.agencyId || user.agencyId;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/apprentice/attract/${apprenticeId}/${agencyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Error al captar aprendiz');
      setSuccessMessage('Aprendiz captado exitosamente');
      setOpenSuccess(true);
    } catch (error) {
      setErrorMessage('Error al captar aprendiz');
      setOpenError(true);
    }
  };

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
        <Button variant="contained" color="primary" onClick={() => handleAttract(params.row.id)}>
          Captar
        </Button>
      ),
    },
  ];

  const columnsArtistas = [
    { field: 'ArtistName', headerName: 'Nombre Artístico', width: 200 },
    { field: 'DebutDate', headerName: 'Fecha Debut', width: 150 },
    { field: 'Status', headerName: 'Estado', width: 120 },
    {
      field: 'accion',
      headerName: 'Acción',
      flex: 1,
      renderCell: (params: any) => (
        <Button variant="contained" color="success" onClick={() => handleOpenContractModal(params.row)}>
          Ofrecer Contrato
        </Button>
      ),
    },
  ];
//Aqui luego se ponen las columnas de los datos correspondientes al backend
  const columnsGroups = [
    {field:'name',headerName:'Nombre del Grupo' , width:200},
    {field:'action',
      headername:'Acción',
      flex : 1,
      renderCell: (params: any) => (
        <Button variant="contained" color="success" onClick={() => handleOpenContractModal(params.row)}>
          Ofrecer Contrato
        </Button>
      ),
    }
  ]

  const [vista, setVista] = useState<'aprendices' | 'artistas' | 'grupos'>('aprendices');
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractModalData, setContractModalData] = useState<any | null>(null);
  const [apprenticeScoutRows, setApprenticeScoutRows] = useState<any[]>([]);
  const [groupScoutRows,setGroupsScoutRows] = useState<any[]>([])
  const [artistsScoutRows, setArtistsScoutRows] = useState<any[]>([]);
  const [apprenticeID, setapprenticeID] = useState<any>('');
  const [groupID, SetgroupId] = useState<any>('');

  const handleOpenContractModal = async (artistRow: any) => {
    const agencyId = user?.profileData?.agencyId || '';
    setapprenticeID(artistRow.ApprenticeId || '');
    SetgroupId(artistRow.GroupId || '');
    let agencyName = '';
    if (agencyId) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/agency/${agencyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          agencyName = data?.name || '';
        }
      } catch (error) {
        console.error('Error al obtener el nombre de la agencia', error);
      }
    }
    setContractModalData({
      artistName: artistRow.ArtistName,
      groupName: artistRow.GroupName || '',
      agencyId,
      agencyName,
    });
    setShowContractModal(true);
  };

  const handleContractSave = async (formData: any) => {
    try {
      console.log(apprenticeID);
      console.log(groupID);
      const token = localStorage.getItem('token');
      // Adaptar el payload al formato requerido por el backend
      const payload = {
        type: 'Artist',
        agencyId: user?.profileData?.agencyId || user?.agencyId,
        startDate: formData.startDate,
        initialConditions: formData.terms,
        incomeDistribution: formData.value,
        apprenticeId: apprenticeID || formData.apprenticeId || '',
        groupId: groupID || formData.groupId || formData.GroupId || '',
      };
      const response = await fetch('http://localhost:3000/api/contract', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Error al ofrecer contrato');
      setSuccessMessage('Contrato ofrecido exitosamente');
      setOpenSuccess(true);
      setShowContractModal(false);
    } catch (error) {
      setErrorMessage('Error al ofrecer contrato');
      setOpenError(true);
    }
  };

  useEffect(
    () => {
      const fetchScout = async () => {
        try {
          const token = localStorage.getItem('token')
          const response = await fetch('http://localhost:3000/api/apprentice/scout', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error("Error al obtener los aprendices")
          }
          const data = await response.json()
          console.log(data)
          const formattedData = data.data.map((apprentice: any, index: number) => ({
            id: apprentice.id ?? index,
            name: apprentice.name,
            age: apprentice.age,
            dateOfBirth: apprentice.dateOfBirth,
            trainingLv: apprentice.trainingLv
          }))
          setApprenticeScoutRows(formattedData)

          const artist_response = await fetch('http://localhost:3000/api/contract/offer', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!artist_response.ok) {
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
        catch (error) {
          console.error(error)
        }
      }
      fetchScout()
    }, []
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
          <Button
            variant={vista === 'grupos'? 'contained' : 'outlined'}
            color='secondary'
            onClick={() => setVista('grupos')}
          >
            Ofrecer Contratos a Grupos
          </Button>
        </Box>
                  {(() => {
            switch (vista) {
              case 'aprendices':
                return (
                  <DataTable 
                    columns={columnsAprendices} 
                    rows={apprenticeScoutRows} 
                    pagesize={5} 
                    showCreateButton={false} 
                  />
                );
              case 'artistas':
                return (
                  <DataTable 
                    columns={columnsArtistas} 
                    rows={artistsScoutRows} 
                    pagesize={5} 
                    showCreateButton={false} 
                  />
                );
              case 'grupos':
                return (
                  <DataTable 
                    columns={columnsGroups} 
                    rows={groupScoutRows} 
                    pagesize={5} 
                    showCreateButton={false} 
                  />
                );
              default:
                return null;
            }
          })()}
        {/* {vista === 'aprendices' ? (
          <DataTable columns={columnsAprendices} rows={apprenticeScoutRows} pagesize={5} showCreateButton={false} />
        ) : (
          <DataTable columns={columnsArtistas} rows={artistsScoutRows} pagesize={5} showCreateButton={false} />
        )} */}
        {/* Modal para campos del contrato */}
        <ModalCreate
          isOpen={showContractModal}
          title="Ofrecer Contrato"
          createFields={contractFields}
          onSave={handleContractSave}
          onClose={() => setShowContractModal(false)}
          {...(contractModalData ? { data: contractModalData } : {})}
        />
        <ConfirmDialog
          open={openSuccess}
          type="success"
          title="¡Éxito!"
          message={successMessage}
          onCancel={() => setOpenSuccess(false)}
          onConfirm={() => setOpenSuccess(false)}
          confirmText="Aceptar"
          showDeleteButton={false}
        />
        <ConfirmDialog
          open={openError}
          type="error"
          title="Error"
          message={errorMessage}
          onCancel={() => setOpenError(false)}
          onConfirm={() => setOpenError(false)}
          confirmText="Aceptar"
          showDeleteButton={false}
        />
      </Box>
    </PageLayout>
  );
};

export default Scout;