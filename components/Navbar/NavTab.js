import React from 'react'
import styles from '../../styles/Navbar.module.css'

const NavTab = ({ label, active, onClick }) => {
    return (
        <div className={active ? `${styles.tab} ${styles.active}` : styles.tab} onClick={onClick}>
            {label}
        </div>
    )
}

export default NavTab