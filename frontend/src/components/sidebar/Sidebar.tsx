import "./sidebar.css";
import logo from "../../assets/KPopWorld logo.png"
import {useAuth} from "../../contexts/auth/AuthContext"
import { Link } from "react-router-dom";
import { MenuByRole ,type MenuSection } from "../../config/role";


interface SidebarProps{
    collapsed: boolean;
    role : string;
}
const Sidebar : React.FC<SidebarProps> = ({collapsed,role}) => {
    const {logout} = useAuth();
    const menuSections : MenuSection[] = MenuByRole[role]
    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="top">
                {!collapsed && <img src={logo} alt="KPop-Dashboard" className="logo"/>}
            </div>
            <hr/>
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