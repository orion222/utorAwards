import {
  Card,
  CardContent,
  Box,
  Chip,
  Typography,
  Stack,
  Divider,
  Button,
} from "@mui/material";

export default function RedemptionCard({ redemption, onProcess, processing }) {
  if (!redemption) return null;

  let formattedDate = "N/A";
  if (redemption.createdAt) {
    const date = new Date(redemption.createdAt);
    if (!isNaN(date.getTime())) {
      formattedDate = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  return (
    <Box sx={{ p: 2 }}>
        <Card
          variant="outlined"
          sx={{
              borderRadius: 2,
              width: "100%",
          }}
        >
        <CardContent>
            <Chip
                label={redemption.processed ? "PROCESSED" : "UNPROCESSED"}
                color={redemption.processed ? "success" : "default"}
                sx={{ fontWeight: "bold", borderRadius: 1 }}
            />

            <Divider sx={{ my: 2 }} />

            {/* Main Layout */}
            <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
            >

            {/* Left Side */}
            <Stack spacing={1}>
                <DetailsItem label="Transaction ID" value={`#${redemption.id}`} />
                <DetailsItem label="UTORid" value={redemption.user.utorid} />
                {redemption.remark && (
                    <DetailsItem label="Remark" value={redemption.remark} />
                )}
                <DetailsItem label="Created By" value={redemption.createdBy} />
                {redemption.processedBy && (
                    <DetailsItem label="Processed By" value={redemption.processedBy} />
                )}
            </Stack>

            {/* Right side */}
            <Box textAlign="right">
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, color: "text.secondary" }}
                >
                    {redemption.amount} pts
                </Typography>

                <Typography variant="body2" color="textSecondary">
                    Created On: {formattedDate}
                </Typography>

                {!redemption.processed && (
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                        onClick={() => onProcess(redemption)}
                        disabled={processing}
                    >
                        {processing ? "Processing..." : "Process"}
                    </Button>
                )}
            </Box>
            </Stack>
        </CardContent>
        </Card>
    </Box>
  );
}

function DetailsItem({ label, value }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        <Typography component="span" sx={{ fontWeight: "bold", color: "text.primary" }}>{label}:</Typography> {value}
      </Typography>
    </Box>
  );
}