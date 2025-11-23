import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Container } from "@mui/system";
import { useForm, Controller, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { purchaseSchema as schema } from "./constant.js";
import { Stack, Box, TextField, Button, Chip, Paper, Typography, InputAdornment } from "@mui/material";
import FormCard from "../../components/common/FormCard.jsx";
import api from "../../api/api";
import useToast from "../../components/common/hooks/useToast.jsx";

export default function CreatePurchase() {
    const theme = useTheme();
    const { showToast, ToastComponent } = useToast();
    const [promotionIds, setPromotionIds] = useState([]);

    const handleAddPromotionId = () => {
        const value = getValues("promotionId").trim();
        if (value === "") return;
        const num = Number(value);
        if (isNaN(num) || !Number.isInteger(num) || num <= 0) return;
        if (promotionIds.includes(num)) return showToast("Promotion ID already added", "error");
        setPromotionIds(prev => [...prev, num]);
        setValue("promotionId", "");
    };

    const handleRemovePromotionId = (removeId) => {
        setPromotionIds(prev => prev.filter(id => id !== removeId));
    }

    const onSubmit = async (data) => {
        const { utorid, spent, remarks } = data;
        const payload = {
            utorid: utorid,
            type: "purchase",
            spent: Number(spent),
            promotionIds: promotionIds,
            remark: remarks || "",
        }
        try {
            const response = await api.post(`/transactions`, payload);
            showToast("Purchase transaction created successfully", "success");
            reset();
        }
        catch (error) {
            const message = error.response?.data?.error || error.response?.data?.message || "Purchase transaction creation failed";
            showToast(message, "error");
        }
    };

    const { control, handleSubmit, reset, formState: { errors, isSubmitting }, getValues, setValue } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
        utorid: "",
        spent: "",
        promotionId: "",
        remarks: "",
        }
    });
    return (
        <Container
            sx={{
                overflowY: "auto",
            }}
        >
            <Typography variant="h3" pb={1}>Create Purchase Transaction</Typography>
            <Typography variant="body1" color="text.secondary">Process a new purchase and award points to customer</Typography>

            {/* <Box mt={3}> */}
                <FormCard width="100%" contentPadding={1} children={
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={2}>
                                <Typography variant="h4" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                    Purchase Transaction Form
                                </Typography>
                                {/* UTORid */}
                                <LabelWithInput 
                                    label="Customer UTORid"
                                    required
                                    input={
                                        <Controller
                                            name="utorid"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Ex: johndoe8"
                                                    variant="outlined"
                                                    error={!!errors.utorid}
                                                    helperText={errors.utorid?.message}
                                                />
                                            )}
                                        />
                                    }
                                />

                                {/* Spent */}
                                <LabelWithInput 
                                    label="Purchase Amount"
                                    required
                                    input={
                                        <Controller
                                            name="spent"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    variant="outlined"
                                                    error={!!errors.spent}
                                                    helperText={errors.spent?.message}
                                                    slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
                                                />
                                            )}
                                        />
                                    }
                                />
                                

                                {/* Promotion Input */}
                                <LabelWithInput 
                                    label="Add Promotion ID"
                                    input={
                                        <>
                                            <Stack direction="row" spacing={1}>
                                                <Controller 
                                                    name="promotionId"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Ex: 123"
                                                            variant="outlined"
                                                            error={!!errors.promotionId}
                                                            helperText={errors.promotionId?.message}
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={handleAddPromotionId}
                                                >
                                                Add
                                                </Button>
                                            </Stack>
                                            {promotionIds.length > 0 && (
                                                <Stack>
                                                    <Typography variant="subtitle2" color="text.secondary">Added Promotion IDs:</Typography>
                                                    <Paper 
                                                        variant="outlined" 
                                                        sx={{ p: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}
                                                        >
                                                        {promotionIds.map((promo) => (
                                                            <Chip
                                                                key={promo}
                                                                label={promo}
                                                                onDelete={() => handleRemovePromotionId(promo)}
                                                                color="success"
                                                                variant="outlined"
                                                            />
                                                        ))}
                                                    </Paper>
                                                </Stack>
                                            )}
                                        </>
                                    }
                                />

                                {/* Remarks */}
                                <LabelWithInput 
                                    label="Remarks"
                                    input={
                                        <Controller
                                            name="remarks"
                                            control={control}
                                            render={({ field }) => (
                                            <TextField
                                                {...field}
                                                placeholder="Enter any remarks here (Optional)"
                                                multiline
                                                minRows={3}
                                                variant="outlined"
                                                error={!!errors.remarks}
                                                helperText={errors.remarks?.message}
                                            />
                                            )}
                                        />
                                    }
                                />
                                
                                <Typography variant="body5" color="error" sx={{ display: "flex", gap: 1, justifyContent: "flex-end", alignItems: "center", }}>
                                    * Required
                                </Typography>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    disabled={isSubmitting}
                                    sx={{ mt: 2 }}
                                >
                                    {isSubmitting ? "Processing..." : "Create Purchase"}
                                </Button>
                            </Stack>
                        </form>
                        {ToastComponent}
                    </>
                }/>
            {/* </Box> */}
        </Container>
    );
}

function LabelWithInput({label, required, input}) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body1">
                {label}
                {required && <span style={{ color: "red" }}> *</span>}
            </Typography>
            {input}
        </Box>
    );
}
