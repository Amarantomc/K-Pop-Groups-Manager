/* eslint-disable @typescript-eslint/no-explicit-any */
import "./agency.css"
import Sidebar from "../../components/sidebar/Sidebar"
import Datatable from "../../components/datatable/Datatable"
import { agencyColumns } from "../../config/datatableSource"
import { useEffect , useState  } from "react"
import { agencyConstraints } from "../../config/modalConstraints"
import { agencyFields } from "../../config/formSource"
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog"
import Header from "../../components/header/Header"
import PageLayout from "../../components/pageLayout/PageLayout"
import { useAuth } from "../../contexts/auth/AuthContext"
import ModalCreate from "../../components/modal/ModalCreate"
import Modal from "../../components/modal/Modal"



const ListAgency: React.FC = () => {
    const { user } = useAuth();

    const [agencyRows, setAgencyRows] = useState<any[]>([])
    const [agencyToDelete,setAgencyToDelete] = useState<number | null>(null)
    const [openConfirm,setOpenConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const[openAccept,setOpenAccept]=useState(false)
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const askDelete = (id : number) =>{
      setAgencyToDelete(id)
      setOpenConfirm(true)
    }
    useEffect(
        () => {
            const fetchAgencies = async () => {
                try{
                        const token = localStorage.getItem('token')
                        const response = await fetch('http://localhost:3000/api/agency', {
                                    headers: {
                                                'Authorization': `Bearer ${token}`,
                                                'Content-Type': 'application/json'
                                              }
                                });
                    if(!response.ok){
                        throw new Error("Error al obtener las agencias")
                    }
                    const data = await response.json()
                    console.log(data)
                    const formattedData = data.data.map((agency : any , index : number) => ({
                        id : agency.id?? index,
                        name : agency.name,
                        location : agency.address,
                        founded : agency.foundation
                    }))
                    setAgencyRows(formattedData)
                }
                catch(error){
                    console.error(error)
                }
            }
            fetchAgencies()
        },[]
    )

      const handleDelete = async () => {
        if(agencyToDelete === null) return;
        const token = localStorage.getItem('token');
        const headers: Record<string,string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const response = await fetch(`http://localhost:3000/api/agency/${agencyToDelete}`, {
        method: "DELETE"
      });

      const result = await response.json();
      if (result.success) {
        setAgencyRows((prev) => prev.filter((agency) => agency.id !== agencyToDelete));
        setOpenAccept(true);
      } else {
        setErrorMessage(result.message || "Error al eliminar la agencia");
        setOpenError(true);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      setErrorMessage(error instanceof Error ? error.message : "Error al eliminar la agencia");
      setOpenError(true);
    }finally{
      setOpenConfirm(false);
      setAgencyToDelete(null)
    }
  };

  const handleCreateSave = (data: any) => {
    // Enviar al backend
    const API_BASE = 'http://localhost:3000';
    const payload: Record<string, any> = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => { payload[k] = v; });
    } else Object.assign(payload, data);

    (async () => {
      try {
        // Normalizaciones para coincidir con CreateAgencyDTO: name, address, foundation
        if (!payload.address && payload.location) payload.address = payload.location;
        if (!payload.foundation && payload.foundedAt) payload.foundation = payload.foundedAt;

        // Validación cliente mínima
        if (!payload.name || !payload.address || !payload.foundation) {
          setErrorMessage('Faltan campos requeridos: name, address o foundation');
          setOpenError(true);
          return;
        }

        // Asegurar fecha ISO para foundation
        try {
          const d = new Date(payload.foundation);
          if (!isNaN(d.getTime())) payload.foundation = d.toISOString();
        } catch (e) { /* ignore */ }

        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // POST /api/agency - Requiere autenticación y rol Staff
        const url = `${API_BASE}/api/agency`;
        if (import.meta.env.MODE === 'development') console.debug('[ListAgency] POST', url, 'payload:', payload);

        // Endpoint para crear agencia: POST /api/agency/
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          // intentar leer JSON o texto crudo para dar feedback útil
          let msg = 'Error al crear agencia';
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
          const createdAgency = {
            id: result.data.id,
            name: result.data.name,
            location: result.data.address,
            founded: result.data.foundation,
          };
          setAgencyRows(prev => [...prev, createdAgency]);
        }
        setOpenAccept(true)
        // alert('Agencia creada correctamente');
      } catch (err) {
        console.error('Error creando agencia:', err);
        setErrorMessage(err instanceof Error ? err.message : 'Error de red');
        setOpenError(true);
      }
    })();
  };

  const handleEditSave = async (updated: any) => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(`http://localhost:3000/api/agency/${updated.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(
          {
              name: updated.name,
              address: updated.location,
              foundation: updated.founded,
              id: updated.id
          }
        ),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar agencia');
      }
      
      setAgencyRows(prev => prev.map(a => (a.id === updated.id ? updated : a)));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar agencia:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar agencia');
      setOpenError(true);
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const response = await fetch('http://localhost:3000/api/agency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear agencia');
      }

      const data = await response.json();
      const created = {
        id: data.data.id,
        name: data.data.name,
        location: data.data.address,
        founded: data.data.foundation
      };
      setAgencyRows(prev => [...prev, created]);
      setShowCreateModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear agencia:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear la agencia';
      setErrorMessage(errorMsg);
      setShowCreateModal(false);
      setOpenError(true);
    }
  };

     return (
    <PageLayout 
      title="Agencias" 
      description={
        "Listado y gestión de agencias."
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando Agencias...
        </div>
      ) : (<>
        <Datatable
          columns={agencyColumns}
          rows={agencyRows}
          pagesize={10}
          onDelete={askDelete}
          onEditSave={handleEditSave}
          onCreateSave={handleCreateSave}
          constraints={agencyConstraints}
          createEntity="agency"
          showEditButton={true}
          userRole={user?.role}
          // onCreateClick={() => setShowCreateModal(true)}
        />
        <ConfirmDialog message="¿Está seguro que desea eliminar esta agencia?" open={openConfirm} onCancel={() => setOpenConfirm(false)} onConfirm={handleDelete}>
          </ConfirmDialog>
          <ConfirmDialog title="¡Éxito!" message="La agencia ha sido creada correctamente" open={openAccept} onCancel={() => setOpenAccept(false)} onConfirm={() => setOpenAccept(false) } confirmText="Aceptar" showDeleteButton={false}>
          </ConfirmDialog>
          <ConfirmDialog title="Error" message={errorMessage} open={openError} onCancel={() => setOpenError(false)} onConfirm={() => setOpenError(false)} confirmText="Aceptar" showDeleteButton={false}>
          </ConfirmDialog>
        <ModalCreate
          isOpen={showCreateModal}
          title="Crear Agencia"
          createFields={agencyFields}
          onSave={handleFormSubmit}
          onClose={() => setShowCreateModal(false)}
        />
        <Modal
          isOpen={showSuccessModal}
          title="Agencia creada exitosamente"
          onSave={() => setShowSuccessModal(false)}
          onClose={() => setShowSuccessModal(false)}
        />
        </>
      )}
    </PageLayout>
  );
}

export default ListAgency