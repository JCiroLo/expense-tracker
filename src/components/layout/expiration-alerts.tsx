import { Alert, Link, Stack, Typography } from "@mui/material";
import useExpenses from "@/hooks/use-expenses";
import useHighlighter from "@/hooks/use-highlighter";

const ExpirationAlerts = () => {
  const { templates } = useExpenses();
  const highlighter = useHighlighter();

  return (
    <>
      {templates.expired.length > 0 && (
        <Alert severity="error" variant="filled">
          Tienes gastos vencidos:{" "}
          {
            <Stack
              display="inline"
              direction="row"
              flexWrap="wrap"
              divider={
                <Typography component="span" lineHeight={1}>
                  ,&nbsp;
                </Typography>
              }
            >
              {templates.expired.map((template) => (
                <Link
                  key={template.id}
                  component="button"
                  color="warning.contrastText"
                  sx={{ lineHeight: 1, verticalAlign: "baseline" }}
                  onClick={() => highlighter.setId(template.id)}
                >
                  {template.title}
                </Link>
              ))}
            </Stack>
          }
          .
        </Alert>
      )}
      {templates.closeToExpire.length > 0 && (
        <Alert severity="warning" variant="filled">
          Tienes gastos que están por vencer:{" "}
          {
            <Stack
              display="inline"
              direction="row"
              flexWrap="wrap"
              divider={
                <Typography component="span" lineHeight={1}>
                  ,&nbsp;
                </Typography>
              }
            >
              {templates.closeToExpire.map((template) => (
                <Link
                  key={template.id}
                  component="button"
                  color="warning.contrastText"
                  sx={{ lineHeight: 1, verticalAlign: "baseline" }}
                  onClick={() => highlighter.setId(template.id)}
                >
                  {template.title}
                </Link>
              ))}
            </Stack>
          }
          .
        </Alert>
      )}
    </>
  );
};

export default ExpirationAlerts;
