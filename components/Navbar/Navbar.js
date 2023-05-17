import React, { useState } from 'react'
import styles from '../../styles/Navbar.module.css'
import { EthHashInfo, Identicon, Label } from '../GnosisReact'
import NavTab from './NavTab'


const Navbar = () => {

    const [isSponsor, setIsSponsor] = useState(true);

    return (
        <div className={styles.container}>
            <Identicon address="0x4FD3d5db6691c94DBe26302A1b49dE25410bCCb5" className={styles.avatar} />
            <EthHashInfo
                shortName="matic"
                hash={"0x4FD3d5db6691c94DBe26302A1b49dE25410bCCb5"}
                showCopyBtn
                explorerUrl={() => ({ url: 'https://explorer-mumbai.maticvigil.com/address/0x4FD3d5db6691c94DBe26302A1b49dE25410bCCb5', name: 'Matic' })}
                shortenHash={4}
                className={styles.ethHashInfo}
            />

            {
                isSponsor ? (<>
                    {/* <Label style={{ color: "white", fontSize: "20px", fontFamily: "sans-serif", border: "1px solid white", borderRadius: "5px" }}>Sponsor</Label> */}
                    <NavTab label={'Payout'} active={location.pathname == '/dashboard/sponsor'} href='/dashboard/sponsor' />
                    <NavTab label={'History'} active={location.pathname == '/dashboard/sponsor/history'} href='/dashboard/sponsor/history' />
                </>) : (<>
                    <NavTab label={'Manage'} active={location.pathname == '/dashboard'} href='/dashboard' />
                    <NavTab label={'Wallet'} active={location.pathname == '/dashboard/wallet'} href='/dashboard/wallet' />
                    <NavTab label={'Submit'} active={location.pathname == '/dashboard/submit'} href='/dashboard/submit' /></>)
            }
        </div>
    )
}

export default Navbar