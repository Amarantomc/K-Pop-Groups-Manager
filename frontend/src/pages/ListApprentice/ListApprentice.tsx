import "../../styles/listApprentice.css"
import Sidebar from "../../components/sidebar/Sidebar"
// import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { apprenticeColumns } from "../../datatableSource"
import React from "react"

// aqui va el endpoint para obtener los valores de los aprendices
const apprenticeRows = [
  {
    id: 1,
    fullname: "Jimin Park",
    age: 23,
    birthday: "2002-10-13",
    agencyName: "BigHit Entertainment",
    status: "Activo",
    trainingLevel: "Avanzado",
  },
  {
    id: 2,
    fullname: "Lisa Manoban",
    age: 25,
    birthday: "2000-03-27",
    agencyName: "YG Entertainment",
    status: "Activo",
    trainingLevel: "Experto",
  },
  {
    id: 3,
    fullname: "Taehyung Kim",
    age: 24,
    birthday: "2001-12-30",
    agencyName: "BigHit Entertainment",
    status: "En descanso",
    trainingLevel: "Intermedio",
  },
  {
    id: 4,
    fullname: "Rosé Park",
    age: 26,
    birthday: "1999-02-11",
    agencyName: "YG Entertainment",
    status: "Activo",
    trainingLevel: "Avanzado",
  },
  {
    id: 5,
    fullname: "Haechan Lee",
    age: 21,
    birthday: "2004-06-06",
    agencyName: "SM Entertainment",
    status: "En entrenamiento",
    trainingLevel: "Básico",
  },
  {
    id: 6,
    fullname: "Karina Yoo",
    age: 22,
    birthday: "2003-04-11",
    agencyName: "SM Entertainment",
    status: "Activo",
    trainingLevel: "Intermedio",
  },
  {
    id: 7,
    fullname: "Sakura Miyawaki",
    age: 27,
    birthday: "1998-03-19",
    agencyName: "HYBE Labels",
    status: "Activo",
    trainingLevel: "Experto",
  },
];

const ListAgency: React.FC = () => {
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
            <Datatable columns={apprenticeColumns} rows={apprenticeRows}/>
            </div>
        </div>
    )
}

export default ListAgency