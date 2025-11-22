import { Card, Typography, Stack } from "@mui/material";
export default function Modal({ title, children }) {
  return (
    <Card>
      <Stack spacing={2.5}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {title}
        </Typography>
        {children}
      </Stack>
    </Card>
  );
}
