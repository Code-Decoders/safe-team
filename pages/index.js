import styles from "../styles/Home.module.css";
import { useState } from "react";
import { Button } from "../components/GnosisReact";
import { CreateOrJoinTeam } from "../components/modals/CreateOrJoinTeam";
import { CreateTeam } from "../components/modals/CreateTeam";
import { JoinTeam } from "../components/modals/JoinTeam";
import { ResultModal } from "../components/modals/ResultModal";
import useAuthKit from "../hooks/useAuthKit";

export default function Home() {
  const [isCreateOrJoinOpen, setIsCreateOrJoinOpen] = useState(false);

  const [isCreateClicked, setIsCreateClicked] = useState(false);

  const [isJoinClicked, setIsJoinClicked] = useState(false);

  const [teamName, setTeamName] = useState("");

  const [teamCode, setTeamCode] = useState("");

  const [onCreate, setOnCreate] = useState(false);

  const [onJoin, setOnJoin] = useState(false);

  const { safeAuth } = useAuthKit();

  const handleRegister = async () => {
    if (safeAuth) {
      const response = await safeAuth.signIn();
      console.log(response.eoa);

      // TODO: #1 use this address to check if the user is already registered @apoorvam-web3
      // If yes, then show the dashboard page
      // If no, then show the open the modal to create or join a team
      // setIsCreateOrJoinOpen(true);

      // also, save the address in the database with the email of the user
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.appTitle}>MARCH FOR</div>
      <div className={styles.appSubTitle}>
        ACCOUNT <br />
        ABSTRACTION
      </div>
      <p style={{ marginBottom: "50px" }}>HACKATHON</p>
      <Button size="lg" variant="bordered" onClick={handleRegister}>
        Register
      </Button>

      {isCreateOrJoinOpen && (
        <CreateOrJoinTeam
          open={isCreateOrJoinOpen}
          onClose={() => setIsCreateOrJoinOpen(false)}
          onCreate={() => setIsCreateClicked(true)}
          onJoin={() => setIsJoinClicked(true)}
        />
      )}

      {isCreateClicked && (
        <CreateTeam
          open={isCreateClicked}
          onClose={() => setIsCreateClicked(false)}
          onSubmit={(team) => {
            setTeamName(team);
            setOnCreate(true);
          }}
        />
      )}

      {isJoinClicked && (
        <JoinTeam
          open={isJoinClicked}
          onClose={() => setIsJoinClicked(false)}
          onClick={(code) => {
            setTeamCode(code);
            setOnJoin(true);
          }}
        />
      )}
      {onCreate && (
        <ResultModal
          open={onCreate}
          onClose={() => setOnCreate(false)}
          content={
            <span>
              <b
                style={{
                  color: "#008c73",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                {teamName}
              </b>{" "}
              <br />
              You have successfully created your team.
            </span>
          }
          buttonText={"Go to Dashboard"}
          onClick={() => {
            var url = "/dashboard";
            var a = document.createElement("a");
            a.href = url;
            a.click();
          }}
        />
      )}
      {onJoin && (
        <ResultModal
          open={onJoin}
          onClose={() => setOnJoin(false)}
          content={
            <span>
              <b
                style={{
                  color: "#008c73",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Thank You{" "}
              </b>
              <br />
              Please wait for the Leader to Approve.
            </span>
          }
          buttonText={"Close"}
          onClick={() => {}}
        />
      )}
    </div>
  );
}
