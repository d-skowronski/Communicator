import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import useScreenSize from './hooks/screenSize'
import '../css/Main.css'

function SidebarAdderRoute() {
    const screenSize = useScreenSize()

    if(screenSize === 'small'){
        return (
            <div className='main full'>
                <Outlet context={{sidebarVisible:false}}/>
            </div>
        )
    }
    else{
        return (
            <>
                <Sidebar/>
                <div className='main'>
                    <Outlet context={{sidebarVisible:true}}/>
                </div>
            </>
        )
    }
}

export default SidebarAdderRoute