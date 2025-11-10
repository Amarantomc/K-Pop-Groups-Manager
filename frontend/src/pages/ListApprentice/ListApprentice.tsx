import "../../styles/listApprentice.css"
import Sidebar from "../../components/sidebar/Sidebar"
// import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { apprenticeColumns } from "../../datatableSource"
import React from "react"
import { useEffect , useState  } from "react"


const ListAgency: React.FC = () => {

     const [apprenticeRows, setApprenticeRows] = useState<any[]>([])
    
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
    
                const handleDelete = async (id: number) => {
        try {
          const confirmDelete = window.confirm("¿Estás seguro de eliminar este aprendiz?");
          if (!confirmDelete) return;
    
          const response = await fetch(`http://localhost:3000/api/apprentice/${id}`, {
            method: "DELETE",
          });
    
          const result = await response.json();
          if (result.success) {
            setApprenticeRows((prev) => prev.filter((apprentice) => apprentice.id !== id));
          } else {
            alert("Error al eliminar el aprendiz");
          }
        } catch (error) {
          console.error("Error al eliminar:", error);
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

    return (
        <div className="listApprenticeSideBar">
            <Sidebar/>
            <div className="listApprenticeNavBar">
            {/* <Navbar/> */}
            <div className="agency-header">
              <div className="welcome-card">
                <div className="welcome-text">
                  <h1>Aprendices</h1>
                  <p className="hint">Listado y gestión de aprendices.</p>
                </div>
              </div>
            </div>
            <div className="list-container">
              <Datatable columns={apprenticeColumns} rows={apprenticeRows} onDelete={handleDelete} onEditSave={handleEditSave}/>
            </div>
            </div>
        </div>
    )
}

export default ListAgency