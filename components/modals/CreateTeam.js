import { useState } from "react";
import { Button, GenericModal, TextFieldInput } from "../GnosisReact";

export function CreateTeam({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  return (
    <GenericModal
      onClose={onClose}
      open={open}
      title="Create Team"
      body={
        <div
          style={{ display: "flex", flexDirection: "column", gap: "20px 0" }}
        >
          <TextFieldInput
            hiddenLabel
            placeholder="Enter your team name"
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <Button
            size="md"
            variant="contained"
            onClick={() => {
              onSubmit(name);
              onClose();
            }}
          >
            Create
          </Button>
        </div>
      }
    />
  );
}
