import "./sidebar.css";
import logo from "../../assets/KPopWorld logo.png"
import {useAuth} from "../../contextsLocal/AuthContext"
import { Link } from "react-router-dom";
import { MenuByRole ,type MenuSection } from "../../config/role visual";


interface SidebarProps{
    collapsed: boolean;
    role : string;
}
const Sidebar : React.FC<SidebarProps> = ({collapsed,role}) => {
    const {logout} = useAuth();
    const menuSections : MenuSection[] = MenuByRole[role] || MenuByRole['admin']
    
    // Si no hay menú para el rol, no renderizar nada
    if (!menuSections || menuSections.length === 0) {
        return null;
    }
    
    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="top">
                {!collapsed && <img src={logo} alt="KPop-Dashboard" className="logo"/>}
            </div>
            {!collapsed && (<div className="center">
                {menuSections.map((section) =>{
                    return (
                        <div key={section.title}>
                            <p className="title">{section.title}</p>
                            <ul>
                                {section.items.map((item) => {
                                    return(
                                        <li key={item.label} onClick={item.label === "Cerrar Sesión"? logout : undefined}>
                                            <Link to={item.path} style={{textDecoration:"none",color : "inherit"}}>
                                                <span className="icon">{item.icon}</span>
                                                <span>{item.label}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                })}
            </div>)}
            {/* <div className="bottom">
                <div className="colorOption"></div>
                <div className="colorOption"></div>
            </div> */}
        </div>
    )
}

export default Sidebar