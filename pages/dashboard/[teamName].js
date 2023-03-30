import React, { useEffect } from 'react'
import { Button, DataTable, Icon } from '../../components/GnosisReact';
import DashboardLayout from '../../components/layout/DashboardLayout';
import styles from '../../styles/Dashboard.module.css';
import { Polybase } from "@polybase/client";


const db = new Polybase({
  defaultNamespace: "pk/0x0a9f3867b6cd684ca2fbe94831396cbbfaf2a11d47f87ff8d49c6f5a58edf7e940cd0f4804294fa7b72b5a504711817f4a62681e6e9ff2be3f8a936bffdf312e/SafeTeam",
});

const Dashboard = () => {
    const [teamName, setTeamName] = React.useState('');
    const [members, setMembers] = React.useState([

    ]);
    function getData() {
        // TODO: Fetch members from backend and display them in the table and team name @Maadhav
        setTeamName('CodeDecoders');
        setMembers([
            {
                email: 'jainkunal976@gmail.com',
                role: 'Admin',
                isApproved: true,
            },
            {
                email: 'maadhav2001@gmail.com',
                role: 'Member',
                isApproved: true,
            },
            {
                email: 'abc@gmail.com',
                role: 'Member',
                isApproved: false,
            }
        ]);
    }

    function onApprove() {
        // TODO: Approve the member @Maadhav
    }

    function onReject() {
        // TODO: Reject the member @Maadhav
    }

    function onRemove() {
        // TODO: Remove the member @Maadhav
    }

    useEffect(() => {
        getData();
    }, []);
    return ( //TODO - add SAFE wallet. cant add new team members after this. 
        <div className={styles.container}>
            <div className={styles.profile}>
                <div>
                    <h1 style={{ margin: '0px 0px 20px 0px' }}>Hi, <span style={{ color: '#008c73' }}>{teamName}</span></h1>
                    <h3>Members: {members.length}</h3>
                </div>
                <Button size='md' variant='contained'>Submit</Button> 
            </div>
            <div className={styles.memberTableHeader}>
                <div style={{ width: '100px' }}>#</div>
                <div className={styles.divider} />
                <div style={{ flex: 1 }}>EOA</div>
                <div className={styles.divider} />
                <div style={{ width: '100px' }}>Status</div>
                <div className={styles.divider} />
                <div style={{ width: '100px' }}>Role</div>
                <div className={styles.divider} />
                <div style={{ width: '200px' }}>Actions</div>
            </div>
            {
                members.map((member, index) => (
                    <div className={styles.memberTable} key={index}>
                        <div style={{ width: '100px' }}>{index + 1}</div>
                        <div className={styles.divider} />
                        <div style={{ flex: 1 }}>{member.email}</div>
                        <div className={styles.divider} />
                        <div style={{ width: '100px' }}>{member.isApproved ? 'Approved' : 'Pending'}</div>
                        <div className={styles.divider} />
                        <div style={{ width: '100px' }}>{member.role}</div>
                        <div className={styles.divider} />
                        <div style={{ width: '200px', display: 'flex', gap: '0 10px' }}>
                            {!member.isAdmin && !member.isApproved && <div onClick={onApprove} style={{cursor: 'pointer'}}>
                                <Icon type='circleCheck' size='md' color='primary'/>
                            </div>}
                            {(member.role != 'Admin' && !member.isApproved) && <div onClick={onReject} style={{cursor: 'pointer'}}>
                                <Icon type='circleCross' size='md' color='error' />
                            </div>}
                            {(member.role != 'Admin' && member.isApproved) && <div onClick={onRemove} style={{cursor: 'pointer'}}>
                                <Icon type='delete' size='md' color='error' />
                            </div>}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

Dashboard.getLayout = function getLayout(page) {
    return (
        <DashboardLayout>
            {page}
        </DashboardLayout>

    )
}


export default Dashboard