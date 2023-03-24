import styles from '../styles/Home.module.css'
import { useState } from 'react';
import { Button } from '../components/GenosisReact';
import { CreateOrJoinTeam } from '../components/modal/CreateOrJoinTeam';
import { CreateTeam } from '../components/modal/CreateTeam';
import { JoinTeam } from '../components/modal/JoinTeam';
import { ResultModal } from '../components/modal/ResultModal';



export default function Home() {

  const [isOpen, setIsOpen] = useState(false);

  const [isCreateClicked, setIsCreateClicked] = useState(false);

  const [isJoinClicked, setIsJoinClicked] = useState(false);

  const [teamName, setTeamName] = useState("");

  const [teamCode, setTeamCode] = useState("");

  const [onCreate, setOnCreate] = useState(false);

  const [onJoin, setOnJoin] = useState(false);


  return (

    <div className={styles.app}>
      <div className={styles.appTitle}>MARCH FOR</div>
      <div className={styles.appSubTitle}>ACCOUNT <br />ABSTRACTION</div>
      <p style={{ marginBottom: "50px" }}>HACKATHON</p>
      <Button size="lg" variant="bordered" onClick={() => setIsOpen(!isOpen)} >
        Register
      </Button>

      {isOpen && (
        <CreateOrJoinTeam open={isOpen} onClose={() => setIsOpen(false)} onCreate={() => setIsCreateClicked(true)} onJoin={() => setIsJoinClicked(true)} />
      )}

      {isCreateClicked && (
        <CreateTeam open={isCreateClicked} onClose={() => setIsCreateClicked(false)} onSubmit={(team) => {
          setTeamName(team);
          setOnCreate(true);
        }} />
      )}

      {isJoinClicked && (
        <JoinTeam open={isJoinClicked} onClose={() => setIsJoinClicked(false)} onClick={(code) => {
          setTeamCode(code);
          setOnJoin(true);
        }} />
      )}
      {
        onCreate && (
          <ResultModal open={onCreate} onClose={() => setOnCreate(false)} content={<span><b style={{ color: "#008c73", fontSize: "20px", fontWeight: "bold" }}>{teamName}</b> <br />You have successfully created your team.</span>} buttonText={"Go to Dashboard"} onClick={() => { 
            // TODO: Redirect to Dashboard
            var url = "/dashboard";
            var a = document.createElement("a");
            a.href = url;
            a.click();
           }} />)
      }
      {
        onJoin && (
          <ResultModal open={onJoin} onClose={() => setOnJoin(false)} content={<span><b style={{ color: "#008c73", fontSize: "20px", fontWeight: "bold" }}>Thank You </b><br />Please wait for the Leader to Approve.</span>} buttonText={"Close"} onClick={() => { }} />)
      }
    </div>
  )
}

