/* eslint-disable @typescript-eslint/no-explicit-any */
import logo from '../../assets/k-pop-logo.png';
import musicIcon from '../../assets/music-notes-large.svg';
import "./header.css"
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import React from 'react'

interface HeaderProps{
    title: string;
    description: string;
    showlogo? : boolean
    showMusicIcon?: boolean
    collapsed: boolean;
    setCollapsed : any
}

const Header : React.FC<HeaderProps> = ({title,description,showlogo=true,showMusicIcon=false,collapsed,setCollapsed}) =>{
    return (
        <div className='welcome-card'>
            <button className={`collapse-btn ${collapsed ? 'collapsed' : ''}`}
 onClick={() => setCollapsed(!collapsed)}>{collapsed?<MenuIcon/>:<ChevronLeftIcon/>}</button>
             {showlogo && (<img src={logo} alt='IS-K Pop' className='welcome-logo' />)}
             <div className='welcome-text'>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
             {showMusicIcon && (<img src={musicIcon} alt='Music' className='music-icon' />)}
        </div>
    )
}

export default Header