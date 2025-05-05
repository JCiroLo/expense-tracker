import React from "react";
import { useSearchParams } from "react-router";
import { Alert, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import useSessionStore from "@/stores/use-session-store";
import useAsyncEffect from "@/hooks/use-async-effect";
import { auth } from "@/lib/firebase";
import Env from "@/lib/env";

const Signin = () => {
  const { setUser } = useSessionStore();
  const [searchParams] = useSearchParams();

  const [step, setStep] = React.useState<"email" | "confirmation">("email");
  const [error, setError] = React.useState<"email" | "confirmation" | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const verify = searchParams.get("verify");

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);

    if (error) {
      setError(null);
    }
  }

  function handleReset() {
    setStep("email");
    setError(null);
    setEmail("");
  }

  async function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);

    if (error) {
      setError(null);
    }

    try {
      await sendSignInLinkToEmail(auth, email, {
        url: `${Env.APP_URL}/signin?verify=${email}`,
        handleCodeInApp: true,
      });

      setStep("confirmation");
    } catch {
      setError("email");
    } finally {
      setLoading(false);
    }
  }

  useAsyncEffect(async () => {
    if (verify) {
      const email = verify;
      const url = window.location.href;

      if (isSignInWithEmailLink(auth, url)) {
        try {
          setLoading(true);

          const result = await signInWithEmailLink(auth, email, url);

          setUser(result.user);
        } catch {
          setError("confirmation");
        }
      } else {
        setError("confirmation");
      }
    }
  }, [verify]);

  return verify ? (
    <Stack
      alignItems="center"
      justifyContent="center"
      gap={2}
      width="min(100%, 400px)"
      marginX="auto"
      padding={2}
      borderRadius={2}
      bgcolor="background.paper"
    >
      <Typography>Verificando tu correo electrónico...</Typography>
      {error === "confirmation" ? (
        <Alert severity="error" variant="outlined">
          Ha ocurrido un error. Por favor, verifica que tu correo electrónico es correcto e intenta nuevamente.
        </Alert>
      ) : (
        <CircularProgress size={48} />
      )}
      <Button disabled={loading} fullWidth onClick={handleReset}>
        Atrás
      </Button>
    </Stack>
  ) : (
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
      onSubmit={step === "email" ? handleEmailSubmit : undefined}
    >
      {step === "email" ? (
        <>
          <Typography>Ingresa con tu correo electrónico</Typography>
          <Typography variant="body2" fontWeight={300} color="text.secondary" textAlign="center">
            Te enviaremos un enlace de acceso para que puedas iniciar sesión facilmente
          </Typography>
          <TextField value={email} placeholder="example@email.com" fullWidth onChange={handleEmailChange} />
          {error === "email" && (
            <Alert severity="error" variant="outlined">
              Ha ocurrido un error. Por favor, verifica que tu correo electrónico es correcto e intenta nuevamente.
            </Alert>
          )}
          <Button type="submit" loading={loading} fullWidth>
            Enviar
          </Button>
        </>
      ) : step === "confirmation" ? (
        <>
          <Typography>Revisa tu Email</Typography>
          <Typography variant="body2" fontWeight={300} color="text.secondary" textAlign="center">
            Te hemos enviado un enlace de acceso a tu correo electrónico. Sigue las instrucciones para iniciar sesión.
          </Typography>
          <Button variant="outlined" fullWidth onClick={handleReset}>
            Atrás
          </Button>
        </>
      ) : null}
    </Stack>
  );
};

export default Signin;
