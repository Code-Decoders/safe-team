import { useState } from "react";
import { Button, GenericModal, TextFieldInput } from "../GnosisReact";

export function JoinTeam({ open, onClose, onClick }) {
  const [code, setCode] = useState("");
  return (
    <GenericModal
      onClose={onClose}
      open={open}
      title="Join Team"
      body={
        <div
          style={{ display: "flex", flexDirection: "column", gap: "20px 0" }}
        >
          <TextFieldInput
            hiddenLabel
            placeholder="Enter your team code"
            onChange={(e) => setCode(e.currentTarget.value)}
          />
          <Button
            size="md"
            variant="contained"
            onClick={() => {
              onClick(code);
              onClose();
            }}
          >
            Join
          </Button>
        </div>
      }
    />
  );
}
