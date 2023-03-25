import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import styles from '../../styles/Dashboard.module.css'

const Wallet = () => {
    return (
        <div className={styles.container}>
            <div>
                <div className={styles.walletContainer}>
                    <div className={styles.walletHeader}>Total Balance</div>
                    <div className={styles.balance}>$10.00</div>
                </div>
            </div>
        </div>
    )
}

Wallet.getLayout = function getLayout(page) {
    return (
        <DashboardLayout>
            {page}
        </DashboardLayout>

    )
}

export default Wallet