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
            backgroundColor: "#f8faf4",
            borderRadius: 2,
            borderColor: "#d9dccf",
            width: "100%",
        }}
        >
        <CardContent>
            <Chip
                label={redemption.processed ? "PROCESSED" : "UNPROCESSED"}
                sx={{
                bgcolor: redemption.processed ? "#62c53c" : "#e8ebdf",
                fontWeight: "bold",
                borderRadius: 1,
                }}
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
                <DetailsItem label="UTORid" value={redemption.utorid} />
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
                    sx={{ fontWeight: 800, color: "#6b6f5a" }}
                >
                    {redemption.amount} pts
                </Typography>

                <Typography variant="body2" color="textSecondary">
                    Created On: {formattedDate}
                </Typography>

                {!redemption.processed && (
                    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                            bgcolor: "#7cd93a",
                            "&:hover": { bgcolor: "#6bc02e" },
                        }}
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
      <Typography variant="body2" color="textSecondary">
        <strong style={{ color: "#232715" }}>{label}:</strong> {value}
      </Typography>
    </Box>
  );
}