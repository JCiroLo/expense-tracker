import { Alert, Link, Stack, Typography } from "@mui/material";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import useHighlighter from "@/hooks/use-highlighter";

const ExpiredExpenseList = () => {
  const { templates } = useExpenseTracker();
  const highlighter = useHighlighter();

  return (
    <>
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

export default ExpiredExpenseList;
