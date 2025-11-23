/* eslint-disable @typescript-eslint/no-explicit-any */
import "../../styles/listAgency.css"
import Sidebar from "../../components/sidebar/Sidebar"
import Datatable from "../../components/datatable/Datatable"
import { agencyColumns } from "../../datatableSource"
import { useEffect , useState  } from "react"
import { agencyConstraints } from "../../modalConstraints"
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog"
import Header from "../../components/header/Header"



const ListAgency: React.FC = () => {

    const [agencyRows, setAgencyRows] = useState<any[]>([])
    const [agencyToDelete,setAgencyToDelete] = useState<number | null>(null)
    const [openConfirm,setOpenConfirm] = useState(false)

    const askDelete = (id : number) =>{
      setAgencyToDelete(id)
      setOpenConfirm(true)
    }
    useEffect(
        () => {
            const fetchAgencies = async () => {
                try{
                    const response = await fetch("http://localhost:3000/api/agency")
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
    try {
      const response = await fetch(`http://localhost:3000/api/agency/${agencyToDelete}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        setAgencyRows((prev) => prev.filter((agency) => agency.id !== agencyToDelete));
        console.log(agencyRows)
      } else {
        alert("Error al eliminar la agencia");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }finally{
      setOpenConfirm(false);
      setAgencyToDelete(null)
    }
  };

     const handleEditSave = async (updated: any) => {
    await fetch(`http://localhost:3000/api/agency/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
            name: updated.name,
            address: updated.location,
            foundation: updated.founded,
            id: updated.id
        }
      ),
    });
    setAgencyRows(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  };
    const [collapsed,setcollapsed] = useState(false)
    return (
        <div className="listAgencySideBar">
            <Sidebar collapsed={collapsed}/>
            <div className="listAgencyNavBar">
                    <div className="agency-header">
                            <Header title="Agencias" description="Listado y gestión de agencias." showlogo={false} collapsed={collapsed} setCollapsed={setcollapsed}/>
                    </div>
                    <Datatable columns={agencyColumns} rows={agencyRows} onDelete={askDelete} onEditSave = {handleEditSave} constraints={agencyConstraints}/>
            <ConfirmDialog message="¿Está seguro que desea eliminar esta agencia?" open={openConfirm} onCancel={() => setOpenConfirm(false)} onConfirm={handleDelete}showDeleteButton={false}>
            </ConfirmDialog>
            </div>
        </div>
    )
}

export default ListAgency