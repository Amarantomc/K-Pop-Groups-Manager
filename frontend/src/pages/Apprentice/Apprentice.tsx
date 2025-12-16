import React from "react"
import { useEffect, useState } from "react"
import "./apprentice.css"
import Datatable from "../../components/datatable/Datatable"
import { apprenticeConstraints, evaluationConstraints } from "../../config/modalConstraints"
import { apprenticeFields } from '../../config/formSource'
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog"
import PageLayout from "../../components/pageLayout/PageLayout"
import { useAuth } from "../../contexts/auth/AuthContext"
import ModalCreate from "../../components/modal/ModalCreate"
import Modal from "../../components/modal/Modal"
import QuizIcon from '@mui/icons-material/Quiz';
import type { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material"

const ListApprentice: React.FC = () => {
  const { user } = useAuth();
  const [apprenticeRows, setApprenticeRows] = useState<any[]>([])
  const [apprenticeToDelete, setApprenticeToDelete] = useState<number | null>(null)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openAccept, setOpenAccept] = useState(false)
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [selectApprenticeToEvaluate, setSelectApprenticeToEvaluate] = useState<any | null>(null)

  // Enviar evaluación al backend
  const handleEvaluateSubmit = async (formData: Record<string, any>) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      // El campo correcto es score, según constraints y backend
      const payload = {
        apprenticeId: selectApprenticeToEvaluate,
        agencyId: user.profileData?.agencyId || user.agencyId,
        evaluation: Number(formData.score)
      };
      const response = await fetch(`http://localhost:3000/api/apprentice/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('Error al crear evaluación');
      }
      setShowEvaluateModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear evaluación:', error);
      setShowEvaluateModal(false);
      setOpenError(true);
    }
  };

      
    const apprenticeColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre Completo', width: 150 },
    { field: 'dateOfBirth', headerName: 'Fecha de Nacimiento', width: 250 },
    { field: 'age', headerName: 'Edad', width: 90 },
    // {field: 'agencyName', headerName: 'Agencia', width: 150},
    { field: 'trainingLv', headerName: 'Nivel de Entrenamiento', width: 180 },
    {   field:'evaluate',
        headerName:'Evaluación',
        width :200,
        renderCell : (params) => {
            return (
                <div className="Evaluation">
                    <Button startIcon = {<QuizIcon/>} className="evaluate-btn" onClick={() => {setSelectApprenticeToEvaluate(params.row.id);setShowEvaluateModal(true)}}>Evaluar Aprendiz</Button>
                </div>
            )
        }
    }
]

     const askDelete = (id : number) =>{
      setApprenticeToDelete(id)
      setOpenConfirm(true)
     }
        useEffect(
                () => {
                    const fetchApprentices = async () => {
                        try{
                            const token = localStorage.getItem('token')
                        const response = await fetch('http://localhost:3000/api/apprentice', {
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
                            setApprenticeRows(formattedData)
                        }
                        catch(error){
                            console.error(error)
                        }
                    }
                    fetchApprentices()
                },[]
            )
    
                const handleDelete = async () => {
                  if(apprenticeToDelete === null) return;

        try {
          const response = await fetch(`http://localhost:3000/api/apprentice/${apprenticeToDelete}`, {
            method: "DELETE",
          });
    
          const result = await response.json();
          if (result.success) {
            setApprenticeRows((prev) => prev.filter((apprentice) => apprentice.id !== apprenticeToDelete));
            setOpenAccept(true);
          } else {
            setErrorMessage(result.message || "Error al eliminar el aprendiz");
            setOpenError(true);
          }
        } catch (error) {
          console.error("Error al eliminar:", error);
          setErrorMessage(error instanceof Error ? error.message : "Error al eliminar el aprendiz");
          setOpenError(true);
        }finally{
          setOpenConfirm(false);
          setApprenticeToDelete(null)
        }
      };

       const handleEditSave = async (updated: any) => {
        const token = localStorage.getItem('token')
    try {
      await fetch(`http://localhost:3000/api/apprentice/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
          {
              name: updated.name,
              dateOfBirth: updated.dateOfBirth,
              age: Number(updated.age),
              trainingLv: Number(updated.trainingLv),
              id: updated.id
          }
        ),
      });
      setApprenticeRows(prev => prev.map(a => (a.id === updated.id ? updated : a)));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar aprendiz:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar aprendiz');
      setOpenError(true);
    }
  };

  const handleCreateSave = (data: any) => {
    const API_BASE = 'http://localhost:3000';
    const payload: Record<string, any> = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => { payload[k] = v; });
    } else Object.assign(payload, data);

    (async () => {
      try {
        // Normalizaciones
        if (!payload.name && payload.fullName) payload.name = payload.fullName;
        if (!payload.dateOfBirth && payload.birthdate) payload.dateOfBirth = payload.birthdate;
        //if (!payload.trainingLv && payload.trainingLevel) payload.trainingLv = payload.trainingLevel;

        //if (payload.age != null) payload.age = Number(payload.age);
        //if (payload.trainingLv != null) payload.trainingLv = Number(payload.trainingLv);

        // Asegurar fecha ISO
        if (payload.dateOfBirth) {
          try {
            const d = new Date(payload.dateOfBirth);
            if (!isNaN(d.getTime())) payload.dateOfBirth = d.toISOString();
          } catch (e) { /* ignore */ }
        }
        if (payload.agencyId) payload.agencyId = Number(payload.agencyId);


        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // POST /api/apprentice/:id - Requiere autenticación y rol Staff
        // El :id es el agencyId
        const agencyId = payload.agencyId;
        const res = await fetch(`${API_BASE}/api/apprentice/${agencyId}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = 'Error al crear aprendiz';
          try {
            const txt = await res.text();
            try { const j = JSON.parse(txt); msg = j?.message || j?.error || txt || msg; }
            catch { msg = txt || msg; }
          } catch (e) {}
          setErrorMessage(msg);
          setOpenError(true);
          return;
        }

        const result = await res.json().catch(() => null);
        if (result?.data) {
          const created = {
            id: result.data.id,
            name: result.data.name,
            age: result.data.age,
            dateOfBirth: result.data.dateOfBirth,
            trainingLv: result.data.trainingLv,
          };
          setApprenticeRows(prev => [...prev, created]);
        }
        setOpenAccept(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error de red al crear aprendiz';
        setErrorMessage(errorMsg);
        setOpenError(true);
      }
    })();
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      // POST /api/apprentice/:id donde id es agencyId
      const agencyId = user?.agencyId || 1;
      const response = await fetch(`http://localhost:3000/api/apprentice/${agencyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear aprendiz');
      }

      const data = await response.json();
      const created = {
        id: data.data.id,
        name: data.data.name,
        age: data.data.age,
        dateOfBirth: data.data.dateOfBirth,
        trainingLv: data.data.trainingLv,
      };
      setApprenticeRows(prev => [...prev, created]);
      setShowCreateModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear aprendiz:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear aprendiz';
      setErrorMessage(errorMsg);
      setShowCreateModal(false);
      setOpenError(true);
    }
  };

     const handleExportPdf = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/export/apprentices', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al exportar PDF');
    }

    
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aprendices.pdf';
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    setErrorMessage(
      error instanceof Error ? error.message : 'Error al exportar PDF'
    );
    setOpenError(true);
  }
};

        return (
    <PageLayout 
      title="Aprendices" 
      description={
        "Listado y gestión de aprendices."
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando Aprendices...
        </div>
      ) : (<>
        <Datatable
          columns={apprenticeColumns}
          rows={apprenticeRows}
          pagesize={10}
          onDelete={askDelete}
          onEditSave={handleEditSave}
          onCreateSave={handleCreateSave}
          onExport={handleExportPdf}
          constraints={apprenticeConstraints}
          createEntity="apprentice"
          showEditButton={true}
          userRole={user?.role}
          // onCreateClick={() => setShowCreateModal(true)}
        />
        <ConfirmDialog message="¿Está seguro que desea eliminar este aprendiz?" open={openConfirm} onCancel={() => setOpenConfirm(false)} onConfirm={handleDelete} type="confirm">
          </ConfirmDialog>
        <ConfirmDialog 
          title="¡Éxito!"
          message="El aprendiz ha sido creado correctamente" 
          open={openAccept}
          type="success" 
          onCancel={() => setOpenAccept(false)} 
          onConfirm={() => setOpenAccept(false)} 
          confirmText="Aceptar" 
          showDeleteButton={false}
        />
        <ConfirmDialog 
          title="Error"
          message={errorMessage} 
          type="error"
          open={openError} 
          onCancel={() => setOpenError(false)} 
          onConfirm={() => setOpenError(false)} 
          confirmText="Aceptar" 
          showDeleteButton={false}
        />
        <ModalCreate
          isOpen={showCreateModal}
          title="Crear Aprendiz"
          createFields={apprenticeFields}
          onSave={handleFormSubmit}
          onClose={() => setShowCreateModal(false)}
        />
        <Modal
          isOpen={showSuccessModal}
          title="Aprendiz creado exitosamente"
          onSave={() => setShowSuccessModal(false)}
          onClose={() => setShowSuccessModal(false)}
        />
        {/* Modal para evaluar */}
        <Modal
          isOpen={showEvaluateModal}
          title="Evaluar Aprendiz"
          onSave={handleEvaluateSubmit}
          onClose={() => setShowEvaluateModal(false)}
          constraints={evaluationConstraints}
        />
        </>
      )}
    </PageLayout>
  );
}

export default ListApprentice