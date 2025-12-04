/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Datatable from "../../components/datatable/Datatable";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { agencyColumns, userColumns } from "../../config/datatableSource";
import { useAuth } from "../../contexts/auth/AuthContext";
import PageLayout from "../../components/pageLayout/PageLayout";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";
import "./listUsers.css";

const ListUsers: React.FC = () => {
    const { user } = useAuth();
    const [userRows, setUserRows] = useState<any[]>([])
    const [isLoading,setIsLoading] = useState(false)
    const[openAccept,setOpenAccept] = useState(false)
    const [openConfirm,setOpenConfirm] = useState(false)
    const [userToDelete,setUserToDelete] = useState<number | null>(null)

    const askDelete = (id : number) =>{
      setUserToDelete(id)
      setOpenConfirm(true)
    }

    useEffect(
            () => {
                const fetchUsers = async () => {
                    try{
                        const token = localStorage.getItem('token')
                        const response = await fetch('http://localhost:3000/api/user', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
                        if(!response.ok){
                            throw new Error("Error al obtener los usuarios")
                        }
                        const data = await response.json()
                        console.log(data)
                        const formattedData = data.data.map((user : any , index : number) => ({
                            id : user.id?? index,
                            username : user.name,
                            email : user.email,
                        }))
                        setUserRows(formattedData)
                    }
                    catch(error){
                        console.error(error)
                    }
                }
                fetchUsers()
            },[]
        )

            const handleDelete = async () => {
    try {
        if(userToDelete === null) return;

      const token = localStorage.getItem('token');
        const headers: Record<string,string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:3000/api/user/${userToDelete}`, {
        method: "DELETE",
        headers
      });

      const result = await response.json();
      if (result.success) {
        setUserRows((prev) => prev.filter((user) => user.id !== userToDelete));
      } else {
        alert("Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }finally{
      setOpenConfirm(false);
      setUserToDelete(null)
    }
  };

  const handleCreateSave = async (data: FormData | Record<string, any>) => {
    const API_BASE = 'http://localhost:3000';
    const payload: Record<string, any> = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => { payload[k] = v; });
    } else {
      Object.assign(payload, data);
    }

    try {
      // Compatibilidad: si backend espera 'name' en lugar de 'username', rellenarlo desde username
      if (!payload.name && payload.username) {
        payload.name = payload.username;
      }

      // Obtener el rol y el username
      const userRole = (payload.rol || payload.role || '').toLowerCase();
      const username = payload.name || payload.username;

      // Agregar agencyId del usuario actual para todos los roles excepto admin
      if (userRole !== 'admin' && user?.agencyId) {
        payload.agencyId = user.agencyId;
      }

      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Consulta al backend para obtener IDs según el rol usando el username
      if (userRole === 'aprendiz' || userRole === 'apprentice') {
        // Para aprendiz: buscar ID por nombre de usuario
        if (!username) {
          alert('Debe proporcionar el nombre de usuario');
          return;
        }

        try {
          const apprenticeRes = await fetch(`${API_BASE}/api/apprentice?name=${encodeURIComponent(username)}`, { headers });
          if (!apprenticeRes.ok) {
            alert('No se encontró el aprendiz con ese nombre');
            return;
          }
          const apprenticeData = await apprenticeRes.json();
          if (!apprenticeData.data || apprenticeData.data.length === 0) {
            alert('No se encontró el aprendiz con ese nombre');
            return;
          }
          payload.apprenticeId = apprenticeData.data[0].id;
        } catch (error) {
          console.error('Error al buscar aprendiz:', error);
          alert('Error al buscar el aprendiz en el sistema');
          return;
        }
      }

      if (userRole === 'artista' || userRole === 'artist') {
        // Para artista: buscar ID de aprendiz y de grupo usando el username
        if (!username) {
          alert('Debe proporcionar el nombre de usuario');
          return;
        }

        try {
          // Buscar el aprendiz por nombre de usuario
          const apprenticeRes = await fetch(`${API_BASE}/api/apprentice?name=${encodeURIComponent(username)}`, { headers });
          if (!apprenticeRes.ok) {
            alert('No se encontró el aprendiz con ese nombre');
            return;
          }
          const apprenticeData = await apprenticeRes.json();
          if (!apprenticeData.data || apprenticeData.data.length === 0) {
            alert('No se encontró el aprendiz con ese nombre');
            return;
          }
          payload.apprenticeId = apprenticeData.data[0].id;

          // Solicitar nombre del grupo al usuario
          const groupName = prompt('Ingrese el nombre del grupo (opcional, presione Cancelar para omitir):');
          if (groupName && groupName.trim()) {
            const groupRes = await fetch(`${API_BASE}/api/group?name=${encodeURIComponent(groupName.trim())}`, { headers });
            if (!groupRes.ok) {
              alert('No se encontró el grupo con ese nombre');
              return;
            }
            const groupData = await groupRes.json();
            if (!groupData.data || groupData.data.length === 0) {
              alert('No se encontró el grupo con ese nombre');
              return;
            }
            payload.groupId = groupData.data[0].id;
          }
        } catch (error) {
          console.error('Error al buscar aprendiz/grupo:', error);
          alert('Error al buscar los datos en el sistema');
          return;
        }
      }

      const res = await fetch(`${API_BASE}/api/user/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // intentar leer JSON o texto crudo para dar feedback útil
        let msg = 'Error al crear usuario';
        try {
          const txt = await res.text();
          try { const j = JSON.parse(txt); msg = j?.message || j?.error || txt || msg; }
          catch { msg = txt || msg; }
        } catch (e) { }
        alert(msg);
        return;
      }

      const createdUser = await res.json().catch(() => null);
      if (createdUser?.data) {
        // Agregar el nuevo usuario a la tabla
        const newRow = {
          id: createdUser.data.id ?? Date.now(),
          username: createdUser.data.name,
          email: createdUser.data.email,
        };
        setUserRows((prev) => [...prev, newRow]);
      }
      // alert('Usuario creado correctamente');
      setOpenAccept(true)
    } catch (err) {
      console.error('Error creando usuario:', err);
      alert(err instanceof Error ? err.message : 'Error de red');
    }
  };
        return (
    <PageLayout 
      title="Usuarios" 
      description={
        "Listado y gestión de usuarios."
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando Usuarios...
        </div>
      ) : (<>
        <Datatable
          columns={userColumns}
          rows={userRows}
          pagesize={10}
          onDelete={askDelete}
          onCreateSave={handleCreateSave}
          createEntity="user"
          showEditButton={false}
          showCreateButton={false}
        />
        <ConfirmDialog message="¿Está seguro que desea eliminar este usuario?" open={openConfirm} onCancel={() => setOpenConfirm(false)} onConfirm={handleDelete}>
          </ConfirmDialog>
        <ConfirmDialog message="Usuario creado correctamente" open={openAccept} onCancel={() => setOpenAccept(false)} onConfirm={() => setOpenAccept(false) } confirmText="Aceptar" showDeleteButton={false}>
          </ConfirmDialog>
        </>
      )}
    </PageLayout>
  );
}

export default ListUsers