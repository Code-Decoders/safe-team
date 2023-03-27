import React from 'react'
import styles from '../../styles/Navbar.module.css'
import { Identicon, Tab } from '../GnosisReact'
import NavTab from './NavTab'

const Navbar = () => {

    return (
        <div className={styles.container}>
            <Identicon address="CodeDecoders" className={styles.avatar}/>
            <NavTab label={'Manage'} active={location.pathname == '/dashboard'} href='/dashboard'/>
            <NavTab label={'Wallet'} active={location.pathname == '/dashboard/wallet'} href='/dashboard/wallet' />
        </div>
    )
}

export default Navbar