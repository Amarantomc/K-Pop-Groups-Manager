import "../../styles/listAgency.css"
import Sidebar from "../../components/sidebar/Sidebar"
// import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { agencyColumns } from "../../datatableSource"
import React from "react"


const agencyRows = [
  { id: 1, name: 'KQ Entertainment', location: 'Seúl', founded: '2016-12-31' },
  { id: 2, name: 'HYBE', location: 'Seúl', founded: '2005-02-01' },
  { id: 3, name: 'SM Entertainment', location: 'Seúl', founded: '1995-02-14' },
];
// El parametro rows se deja como null por el momento, ya que no se ha implementado la lógica para obtener los datos de las agencias.

const ListAgency: React.FC = () => {
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
                    <Datatable columns={agencyColumns} rows={agencyRows}/>
            </div>
        </div>
    )
}

export default ListAgency