import "../../styles/listUsers.css"
import Sidebar from "../../components/sidebar/Sidebar"
// import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { userColumns } from "../../datatableSource"
import React from "react"

  const userRows = [
  {
    id: 1,
    username: "admin01",
    email: "admin@kpopmanager.com",
    password: "********",
    role: "Administrador",
  },
  {
    id: 2,
    username: "jungkook",
    email: "jk@bighit.com",
    password: "********",
    role: "Entrenador",
  },
  {
    id: 3,
    username: "rosie_p",
    email: "rosie@ygent.com",
    password: "********",
    role: "Aprendiz",
  },
  {
    id: 4,
    username: "karina_y",
    email: "karina@sm.com",
    password: "********",
    role: "Aprendiz",
  },
  {
    id: 5,
    username: "lisa_m",
    email: "lisa@ygent.com",
    password: "********",
    role: "Entrenador",
  },
  {
    id: 6,
    username: "hybe_admin",
    email: "hybe@hybe.com",
    password: "********",
    role: "Administrador",
  },
  {
    id: 7,
    username: "staff01",
    email: "staff@kpopmanager.com",
    password: "********",
    role: "Soporte",
  },
];

const ListUsers: React.FC = () => {
    return (
        <div className="listUsersSideBar">
            <Sidebar/>
            <div className="listUsersNavBar">
                {/* <Navbar/> */}
                <Datatable columns={userColumns} rows={userRows}/>
            </div>
        </div>
    )
}

export default ListUsers