import '../../styles/navbar.css'
import React from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
const NavBar : React.FC = () =>{
    return (
        <div className='navbar'>
            <div className='wrapper'>
                <div className='search'>
                    <input type='text' placeholder='Buscar...'/>
                    <SearchOutlinedIcon/>
                </div>
                <div className='items'>
                    <div className='item'>
                        <LanguageOutlinedIcon className='icon-nav'/>
                        Español
                    </div>
                    <div className='item'>
                        <DarkModeOutlinedIcon className='icon-nav'/>
                    </div>
                    <div className='item'>
                        <FullscreenExitOutlinedIcon className='icon-nav'/>
                    </div>
                    <div className='item'>
                        <NotificationsNoneOutlinedIcon className='icon-nav'/>
                        <div className='counter'>1</div>
                    </div>
                    <div className='item'>
                        <ChatBubbleOutlineOutlinedIcon className='icon-nav'/>
                        <div className='counter'>1</div>
                    </div>
                    <div className='item'>
                        <ListOutlinedIcon className='icon-nav'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar