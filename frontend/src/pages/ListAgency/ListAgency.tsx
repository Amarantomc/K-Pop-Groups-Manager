import "../../styles/listAgency.css"
import Sidebar from "../../components/sidebar/Sidebar"
// import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { agencyColumns } from "../../datatableSource"
import React from "react"
import { useEffect , useState  } from "react"
import { agencyConstraints } from "../../modalConstraints"



const ListAgency: React.FC = () => {

    const [agencyRows, setAgencyRows] = useState<any[]>([])

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

      const handleDelete = async (id: number) => {
    try {
      const confirmDelete = window.confirm("¿Estás seguro de eliminar esta agencia?");
      if (!confirmDelete) return;

      const response = await fetch(`http://localhost:3000/api/agency/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        setAgencyRows((prev) => prev.filter((agency) => agency.id !== id));
        console.log(agencyRows)
      } else {
        alert("Error al eliminar la agencia");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
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

    return (
        <div className="listAgencySideBar">
            <Sidebar/>
            <div className="listAgencyNavBar">
                    {/* <Navbar/> */}
                    <div className="agency-header">
                        <div className="welcome-card">
                            <div className="welcome-text">
                                <h1>Agencias</h1>
                                <p className="hint">Listado y gestión de agencias.</p>
                            </div>
                        </div>
                    </div>
                    <Datatable columns={agencyColumns} rows={agencyRows} onDelete={handleDelete} onEditSave = {handleEditSave} constraints={agencyConstraints}/>
            </div>
        </div>
    )
}

export default ListAgency