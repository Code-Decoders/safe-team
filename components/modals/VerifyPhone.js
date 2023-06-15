import { useEffect, useState } from "react";
import { Button, GenericModal, TextFieldInput } from "../GnosisReact";
import { sendSmsVerificationToken, verifyToken } from "../../services/twillio";
import useSocialConnect from "../../hooks/useSocialConnect";

export function VerifyPhone({
  phoneNumber,
  safeAuth,
  open,
  onClose,
  onVerified,
}) {
  const [phone, setPhone] = useState(phoneNumber ?? "");
  const [openOTP, setOpenOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const { fetchAccounts, fetchIdentifiers } = useSocialConnect();
  const verifyPhone = async () => {
    const res = await verifyToken(phone, otp);
    if (res) {
      onVerified();
    } else {
      alert("Invalid OTP");
    }
  };

  const checkIfAlreadyExists = async () => {
    const accounts = await fetchAccounts(phone);
    const { eoa } = await safeAuth.signIn();
    const identifiers = await fetchIdentifiers(eoa);
    console.log("Identifiers", identifiers);
    console.log("Accounts", accounts);
    if (
      (accounts?.length ?? 0) > 0 &&
      accounts[0].toLowerCase() !== eoa.toLowerCase()
    ) {
      alert("Phone number already registered with another account");
    } else if (identifiers?.length > 0 && (accounts?.length ?? 0) === 0) {
      alert("Account already registered with different phone number");
    } else {
      setOpenOTP(true);
      sendSmsVerificationToken(phone);
    }
  };

  if (openOTP) {
    return (
      <GenericModal
        onClose={() => setOpenOTP(false)}
        open={true}
        title="Enter the code we sent to your number"
        body={
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px 0" }}
          >
            <p
              style={{
                whiteSpace: "initial",
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              OTP Sent to {phone}
            </p>
            <TextFieldInput
              hiddenLabel
              placeholder="123456"
              onChange={(e) => setOtp(e.currentTarget.value)}
              inputMode="numeric"
            />
            <Button
              size="md"
              variant="contained"
              onClick={() => {
                verifyPhone();
              }}
            >
              Validate OTP
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <GenericModal
      onClose={onClose}
      open={open}
      title="Verify Phone Number"
      body={
        <div
          style={{ display: "flex", flexDirection: "column", gap: "20px 0" }}
        >
          <TextFieldInput
            hiddenLabel
            placeholder="+91 7819031956"
            onChange={(e) => setPhone(e.currentTarget.value)}
            inputProps={{ pattern: "[+][0-9]{1,3}[0-9]{10}" }}
            error={
              phone.length > 0 && !phone.match("[+][0-9]{1,3}[0-9]{10}")
                ? "Invalid phone number"
                : ""
            }
          />
          <Button
            size="md"
            variant="contained"
            disabled={
              phone.length === 0 || !phone.match("[+][0-9]{1,3}[0-9]{10}")
            }
            onClick={checkIfAlreadyExists}
          >
            Verify
          </Button>
        </div>
      }
    />
  );
}
