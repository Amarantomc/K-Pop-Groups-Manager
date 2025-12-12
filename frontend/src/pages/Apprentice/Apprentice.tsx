/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./apprentice.css"
import Sidebar from "../../components/sidebar/Sidebar"
// import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { apprenticeColumns } from "../../config/datatableSource"
import React from "react"
import { useEffect , useState  } from "react"
import { apprenticeConstraints } from "../../config/modalConstraints"
import { APPRENTICE_STATUS, APPRENTICE_STATUS_OPTIONS, apprenticeFields } from '../../config/formSource'
import Header from "../../components/header/Header"
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog"
import PageLayout from "../../components/pageLayout/PageLayout"
import { useAuth } from "../../contexts/auth/AuthContext"
import ModalCreate from "../../components/modal/ModalCreate"
import Modal from "../../components/modal/Modal"


const ListApprentice: React.FC = () => {
     const { user } = useAuth();
     const [apprenticeRows, setApprenticeRows] = useState<any[]>([])
     const [apprenticeToDelete,setApprenticeToDelete] = useState<number | null>(null)
     const [openConfirm,setOpenConfirm] = useState(false)
     const [openAccept,setOpenAccept] = useState(false)
     const [openError, setOpenError] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const [isLoading,setIsLoading] = useState(false)
     const [showCreateModal, setShowCreateModal] = useState(false);
     const [showSuccessModal, setShowSuccessModal] = useState(false);

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
                                status : apprentice.status,
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
    try {
      await fetch(`http://localhost:3000/api/apprentice/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
              name: updated.name,
              dateOfBirth: updated.dateOfBirth,
              age: Number(updated.age),
              status: updated.status,
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
        if (!payload.trainingLv && payload.trainingLevel) payload.trainingLv = payload.trainingLevel;

        if (payload.age != null) payload.age = Number(payload.age);
        if (payload.trainingLv != null) payload.trainingLv = Number(payload.trainingLv);

        // mapear status
        const statusRaw = payload.status;
        if (statusRaw) {
          const found = APPRENTICE_STATUS_OPTIONS.find((o:any) => o.value === statusRaw || o.label === statusRaw || String(o.value) === String(statusRaw));
          if (found) payload.status = found.value;
        }

        // Asegurar fecha ISO
        if (payload.dateOfBirth) {
          try {
            const d = new Date(payload.dateOfBirth);
            if (!isNaN(d.getTime())) payload.dateOfBirth = d.toISOString();
          } catch (e) { /* ignore */ }
        }

        // Validación básica de status
        const allowed = (APPRENTICE_STATUS as readonly string[]).map(s => String(s));
        if (!payload.status || !allowed.includes(String(payload.status))) {
          setErrorMessage(`Estado inválido: "${payload.status}". Opciones válidas: ${allowed.join(', ')}`);
          setOpenError(true);
          return;
        }

        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // POST /api/apprentice/:id - Requiere autenticación y rol Staff
        // El :id es el agencyId
        const agencyId = user?.agencyId || 1; // Usar agencyId del usuario autenticado
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
            status: result.data.status,
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
        status: data.data.status,
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
          constraints={apprenticeConstraints}
          createEntity="apprentice"
          showEditButton={true}
          userRole={user?.role}
          // onCreateClick={() => setShowCreateModal(true)}
        />
        <ConfirmDialog message="¿Está seguro que desea eliminar este aprendiz?" open={openConfirm} onCancel={() => setOpenConfirm(false)} onConfirm={handleDelete}>
          </ConfirmDialog>
        <ConfirmDialog 
          title="¡Éxito!"
          message="El aprendiz ha sido creado correctamente" 
          open={openAccept} 
          onCancel={() => setOpenAccept(false)} 
          onConfirm={() => setOpenAccept(false)} 
          confirmText="Aceptar" 
          showDeleteButton={false}
        />
        <ConfirmDialog 
          title="Error"
          message={errorMessage} 
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
        </>
      )}
    </PageLayout>
  );
}

export default ListApprentice