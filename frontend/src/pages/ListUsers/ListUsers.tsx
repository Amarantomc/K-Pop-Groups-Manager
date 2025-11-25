/* eslint-disable @typescript-eslint/no-explicit-any */
import "../../styles/listUsers.css"
import Sidebar from "../../components/sidebar/Sidebar"
// import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { userColumns } from "../../config/datatableSource"
import React from "react"
import { useEffect , useState } from "react"
import Header from "../../components/header/Header"

const ListUsers: React.FC = () => {

    const [userRows, setUserRows] = useState<any[]>([])

    useEffect(
            () => {
                const fetchUsers = async () => {
                    try{
                        const response = await fetch("http://localhost:3000/api/user")
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

            const handleDelete = async (id: number) => {
    try {
      const confirmDelete = window.confirm("¿Estás seguro de eliminar este usuario?");
      if (!confirmDelete) return;

      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        setUserRows((prev) => prev.filter((user) => user.id !== id));
      } else {
        alert("Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };
  const [collapsed,setCollapsed] = useState(false)
    return (
        <div className="listUsersSideBar">
            <Sidebar collapsed={collapsed}/>
            <div className="listUsersNavBar">
            {/* <Navbar/> */}
            <div className="agency-header">
              <Header title="Usuarios" description="Listado y gestión de usuarios." showlogo={false} collapsed={collapsed} setCollapsed={setCollapsed}/>
            </div>
            <Datatable columns={userColumns} rows={userRows} onDelete={handleDelete} showEditButton={false}/>
            </div>
        </div>
    )
}

export default ListUsers