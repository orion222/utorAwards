import { Card, CardContent, Stack, Chip, Box, Typography } from "@mui/material";

function TransactionItemCard({ transaction }) {
    const test = "red";

    return (
        <Card 
            variant="outlined" 
            sx={{ 
                width: "100%",
                maxWidth: "unset",
                flex: 1,
                m: 2,
                borderRadius: 3,
                position: "relative",
                overflow: "visible",
            }}
        >
            {/* Colour strip */}
            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    bgcolor: test,
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                }}
            />

            {/* Main content */}
            <CardContent sx={{ px: 3, py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ flex: 1, pr: 2 }}>
                        <Stack direction="row" spacing={1} mb={2}>
                            <Chip 
                                label="PURCHASE" 
                                variant="outlined" 
                                size="medium" 
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                }} 
                            />
                            <Chip 
                                label="PROCESSED" 
                                color="primary" 
                                size="medium" 
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                }} 
                            />
                            <Chip 
                                label="SUSPICIOUS" 
                                color="error" 
                                size="medium" 
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                }} 
                            />
                        </Stack>
                        <Typography fontWeight={600}>More details</Typography>
                        <Typography variant="body2" color="text.secondary">
                            eirjforiejfeorifjre
                        </Typography>
                    </Box>

                    <Box 
                        sx={{  
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            textAlign: "right",
                        }}
                    >
                        <Typography variant="h4">+100 pts</Typography>
                        <Typography variant="body2" color="text.secondary">Spent: $100</Typography>
                        <Typography variant="body2" color="text.secondary">Jan 20, 2025</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default TransactionItemCard;