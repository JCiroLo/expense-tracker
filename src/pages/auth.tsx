import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { MuiTelInput, MuiTelInputInfo } from "mui-tel-input";
import { MuiOtpInput } from "mui-one-time-password-input";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import useSessionStore from "@/stores/use-session-store";
import { auth } from "@/lib/firebase";

const recaptchaContainerId = "recaptcha-container";
let recaptchaVerifier: RecaptchaVerifier | null = null;

const Auth = () => {
  const { setUser } = useSessionStore();

  const [step, setStep] = React.useState<"phone" | "code">("phone");
  const [error, setError] = React.useState<"phone" | "code" | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState<ConfirmationResult | null>(null);
  const [phone, setPhone] = React.useState({ number: "", raw: "" });
  const [code, setCode] = React.useState("");

  function handlePhoneChange(newPhone: string, info: MuiTelInputInfo) {
    setPhone({ number: newPhone, raw: info.numberValue || "" });
  }

  function handleCodeChange(newCode: string) {
    setCode(newCode);
  }

  function handleReset() {
    setStep("phone");
    setError(null);
    setConfirmation(null);
    setPhone({ number: "", raw: "" });
    setCode("");
  }

  async function handlePhoneSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!recaptchaVerifier) {
      return;
    }

    setLoading(true);

    try {
      const response = await signInWithPhoneNumber(auth, phone.raw, recaptchaVerifier);

      setConfirmation(response);
      setStep("code");
    } catch {
      setError("phone");
    } finally {
      setLoading(false);
    }
  }

  async function handleCodeSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!confirmation) {
      return;
    }

    setLoading(true);

    try {
      const result = await confirmation.confirm(code);
      setUser(result.user);
    } catch {
      setError("code");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: "invisible",
      callback: () => {},
    });
  }, []);

  return (
    <>
      <div id={recaptchaContainerId} />
      {step === "phone" ? (
        <Stack
          component="form"
          alignItems="center"
          justifyContent="center"
          gap={2}
          width="min(100%, 400px)"
          marginX="auto"
          padding={2}
          borderRadius={2}
          bgcolor="background.paper"
          onSubmit={handlePhoneSubmit}
        >
          <Typography>Ingresa con tu número de teléfono</Typography>
          <Typography variant="body2" fontWeight={300} color="text.secondary">
            Enviaremos un código de verificación por SMS
          </Typography>
          <MuiTelInput value={phone.number} defaultCountry="CO" forceCallingCode fullWidth onChange={handlePhoneChange} />
          <Button type="submit" loading={loading} fullWidth>
            Enviar código
          </Button>
        </Stack>
      ) : step === "code" ? (
        <Stack
          component="form"
          alignItems="center"
          justifyContent="center"
          gap={2}
          width="min(100%, 400px)"
          marginX="auto"
          padding={2}
          borderRadius={2}
          bgcolor="background.paper"
          onSubmit={handleCodeSubmit}
        >
          <Typography>Verificar número de teléfono</Typography>
          <Typography variant="body2" fontWeight={300} color="text.secondary" textAlign="center" sx={{ textWrap: "balance" }}>
            Hemos enviado un código de verificación al número {phone.number}
          </Typography>
          <MuiOtpInput value={code} length={6} gap={1} TextFieldsProps={{ fullWidth: true }} onChange={handleCodeChange} />
          <Button type="submit" loading={loading} fullWidth>
            Verificar
          </Button>
          <Button variant="text" disabled={loading} fullWidth onClick={handleReset}>
            Volver
          </Button>
        </Stack>
      ) : null}
    </>
  );
};

export default Auth;
