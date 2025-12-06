import { useState, useEffect } from "react";
import { Container } from "@mui/system";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { purchaseSchema as schema } from "./constant.js";
import { Box, Stack, TextField, Button, Chip, Paper, Typography, InputAdornment } from "@mui/material";
import FormCard from "../../components/common/FormCard.jsx";
import api from "../../api/api";
import useToast from "../../components/common/hooks/useToast.jsx";
import LabeledField from "../../components/common/LabeledField.jsx";

export default function CreatePurchase() {
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
            setPromotionIds([]);
            reset(defaultValues);
            showToast("Purchase transaction created successfully", "success");
        }
        catch (error) {
            const errMessage = error.response?.data?.error || error.response?.data?.message || "Purchase transaction creation failed";
            const msg = (
            <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>Purchase Transaction Creation Failed</Typography>
                <Typography variant="body2" sx={{ fontFamily: "Inter, sans-serif" }}>An error has occurred: {errMessage}</Typography>
                <Typography variant="body2" sx={{ fontFamily: "Inter, sans-serif" }}>Please try again later.</Typography>
                <Typography variant="body2" sx={{ fontFamily: "Inter, sans-serif" }}>If this error persists, please contact your manager.</Typography>
            </Stack>
            );
            showToast(msg, "error");
        }
    };

    const defaultValues = {
        utorid: "",
        spent: "",
        promotionId: "",
        remarks: "",
    };

    const { control, handleSubmit, reset, formState: { errors, isSubmitting }, getValues, setValue } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: defaultValues
    });

    const formValues = useWatch({ control });
    
    return (
        <>
            <Typography variant="h4" pb={1}>Create Purchase Transaction</Typography>
            <Typography variant="body1" color="text.secondary">Process a new purchase and award points to customer</Typography>

            <FormCard>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <Box component="h2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            Purchase Transaction Form
                        </Box>

                        {/* UTORid */}
                        <LabeledField label="Customer UTORid" required>
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
                        </LabeledField>

                        {/* Spent */}
                        <LabeledField label="Purchase Amount" required>
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
                        </LabeledField>
                        

                        {/* Promotion Input */}
                        <LabeledField label="Add Promotion ID">
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
                        </LabeledField>

                        {/* Remarks */}
                        <LabeledField label="Remarks">
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
                        </LabeledField>

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
            </FormCard>
        </>
    );
}
