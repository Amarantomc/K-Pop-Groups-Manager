/* eslint-disable @typescript-eslint/no-explicit-any */
import "../../styles/listApprentice.css"
import Sidebar from "../../components/sidebar/Sidebar"
// import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { apprenticeColumns } from "../../config/datatableSource"
import React from "react"
import { useEffect , useState  } from "react"
import { apprenticeConstraints } from "../../config/modalConstraints"
import Header from "../../components/header/Header"
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog"


const ListApprentice: React.FC = () => {

     const [apprenticeRows, setApprenticeRows] = useState<any[]>([])
     const [apprenticeToDelete,setApprenticeToDelete] = useState<number | null>(null)
     const [openConfirm,setOpenConfirm] = useState(false)

     const askDelete = (id : number) =>{
      setApprenticeToDelete(id),
      setOpenConfirm(true)
     }
        useEffect(
                () => {
                    const fetchApprentices = async () => {
                        try{
                            const response = await fetch("http://localhost:3000/api/apprentice")
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
          } else {
            alert("Error al eliminar el aprendiz");
          }
        } catch (error) {
          console.error("Error al eliminar:", error);
        }finally{
          setOpenConfirm(false);
          setApprenticeToDelete(null)
        }
      };

       const handleEditSave = async (updated: any) => {
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
  };
    const [collapsed,setCollapsed] = useState(false)
    return (
        <div className="listApprenticeSideBar">
            <Sidebar collapsed={collapsed} role="ADMIN"/>
            <div className="listApprenticeNavBar">
            {/* <Navbar/> */}
            <div className="agency-header">
              <Header title="Aprendices" description="Listado y gestión de aprendices" showlogo={false} collapsed={collapsed} setCollapsed={setCollapsed}/>
            </div>
            <Datatable columns={apprenticeColumns} rows={apprenticeRows} onDelete={askDelete} onEditSave={handleEditSave} constraints={apprenticeConstraints}/>
            </div>
            <ConfirmDialog message="¿Está seguro que desea eliminar este aprendiz?" open={openConfirm} onCancel={() => setOpenConfirm(false)} onConfirm={handleDelete}>
            </ConfirmDialog>
        </div>
    )
}

export default ListApprentice