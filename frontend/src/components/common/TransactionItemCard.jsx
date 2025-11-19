import { Card, CardContent, Stack, Chip, Box, Typography } from "@mui/material";

function TransactionItemCard({ transaction }) {
    const { type, spent, amount, remark, user, targetUser, processed, suspicious, createdAt } = transaction;
    const typeToColour = {
        "purchase": "#7CD93A",
        "redemption": "#F59B66",
        "adjustment": "#F2B84B",
        "event": "#7DA4F2",
        "transfer": "#BBA3E5",
    }
    const dateString = new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", });

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
                    bgcolor: typeToColour[type],
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                }}
            />

            {/* Main content */}
            <CardContent sx={{ px: 4, py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ flex: 1, pr: 2 }}>
                        <Stack direction="row" spacing={1} mb={2}>
                            <Chip 
                                label={type.toUpperCase()}
                                variant="outlined" 
                                size="medium" 
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                }} 
                            />
                            <Chip 
                                label={processed ? "PROCESSED" : "UNPROCESSED"}
                                color={processed ? "primary" : ""}
                                variant={processed ? "" : "outlined"}
                                size="medium" 
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                }} 
                            />
                            {suspicious && (
                                <Chip 
                                    label="SUSPICIOUS" 
                                    color="error" 
                                    size="medium" 
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                    }} 
                                />                                
                            )}
                        </Stack>
                        <Typography fontWeight={600}>{remark}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user && `Created by ${user.utorid}`}
                            {targetUser && user && " | "}
                            {targetUser && amount > 0 && `Sent by ${targetUser.utorid}`} 
                            {targetUser && amount < 0 && `Sent to ${targetUser.utorid}`}  
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
                        {amount > 0 ? (
                            <Typography variant="h4" color="primary" fontWeight="bold">+{amount} pts</Typography>
                        ) : (
                            <Typography variant="h4" color="error" fontWeight="bold">{amount} pts</Typography>
                        )}
                        
                        <Typography variant="body2" color="text.secondary">Spent: ${spent}</Typography>
                        <Typography variant="body2" color="text.secondary">{dateString}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default TransactionItemCard;