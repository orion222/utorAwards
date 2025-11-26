import { useState, useEffect } from "react";
import { Container } from "@mui/system";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { purchaseSchema as schema } from "./constant.js";
import { Stack, TextField, Button, Chip, Paper, Typography, InputAdornment } from "@mui/material";
import FormCard from "../../components/common/FormCard.jsx";
import api from "../../api/api";
import useToast from "../../components/common/hooks/useToast.jsx";
import LabeledField from "../../components/common/LabeledField.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

export default function CreateUser() {
    const { showToast, ToastComponent } = useToast();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState(null);

    const onSubmit = async (data) => {
        setFormData(data);
        setShowConfirmDialog(true);
    };

    const handleConfirmCreate = async () => {
        if (!formData) return;
        setProcessing(true);
        setShowConfirmDialog(false);
        const { utorid, name, email } = formData;
        const payload = {
            utorid: utorid,
            name: name,
            email: email
        }
        try {
            const response = await api.post(`/users`, payload);
            localStorage.removeItem("createUserForm");
            reset(defaultValues);
            showToast("User profile created successfully", "success");
        }
        catch (error) {
            const errMessage = error.response?.data?.error || error.response?.data?.message || "User profile creation failed";
            const msg = (
            <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontFamily: "Inter, sans-serif", color: "#232715", fontWeight: 600 }}>User Profile Creation Failed</Typography>
                <Typography variant="body2" sx={{ fontFamily: "Inter, sans-serif", color: "#6b6f5a" }}>An error has occurred: {errMessage}</Typography>
                <Typography variant="body2" sx={{ fontFamily: "Inter, sans-serif", color: "#6b6f5a" }}>Please try again later.</Typography>
                <Typography variant="body2" sx={{ fontFamily: "Inter, sans-serif", color: "#6b6f5a" }}>If this error persists, please contact your manager.</Typography>
            </Stack>
            );
            showToast(msg, "error");
        } finally {
            setProcessing(false);
            setFormData(null);
        }
    };

    const defaultValues = {
        utorid: "",
        name: "",
        email: "",
    };

    const savedValues = (() => {
        try {
            const items = localStorage.getItem("createUserForm");
            return items ? JSON.parse(items) : defaultValues;
        }
        catch {
            return defaultValues;
        }
    })();

    const { control, handleSubmit, reset, formState: { errors, isSubmitting }, getValues, setValue } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {...savedValues}
    });

    const formValues = useWatch({ control });
    
    useEffect(() => {
        try {
            localStorage.setItem("createUserForm", JSON.stringify(formValues || {}));
        } catch (err) {
            console.error("Failed to persist createUserForm to localStorage:", err); //debugging
        }
    }, [formValues]);

    return (
        <Container
            sx={{
                overflowY: "auto",
            }}
        >
            <Typography variant="h4" pb={1}>Create New User Profile</Typography>
            <Typography variant="body1" color="text.secondary">Fill out the form below to create a new user profile in the system</Typography>

            <FormCard width="100%" contentPadding={1} >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <Typography variant="h4" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            User Profile Information
                        </Typography>

                        {/* UTORid */}
                        <LabeledField label="Customer UTORid" required>
                            <Controller
                                name="utorid"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="Ex: johndoe8"
                                        variant="outlined"
                                        error={!!errors.utorid}
                                        helperText={errors.utorid?.message}
                                    />
                                )}
                            />
                        </LabeledField>

                        {/* Name */}
                        <LabeledField label="Full Name" required>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="Ex: John Doe"
                                        variant="outlined"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                        </LabeledField>
                        
                        {/* Email */}
                        <LabeledField label="Email Address" required>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="Ex: johndoe8@mail.utoronto.ca"
                                        variant="outlined"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </LabeledField>
                        
                        <Typography variant="body2" color="error" sx={{ display: "flex", gap: 1, justifyContent: "flex-end", alignItems: "center", }}>
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
                            {isSubmitting ? "Initializing..." : "Create User Profile"}
                        </Button>
                    </Stack>
                </form>
                
                {ToastComponent}
            </FormCard>

            <ConfirmDialog
                open={showConfirmDialog}
                onClose={() => !processing && setShowConfirmDialog(false)}
                title="Confirm User Creation"
                description={
                    <>  
                        <Stack spacing={2} sx={{ p: 1 }}>
                            <Typography variant="body1" sx={{ fontFamily: "Inter, sans-serif", color: "#6b6f5a" }}>Are you sure you want to create a new user with the following details?</Typography>
                            <Typography variant="body1" sx={{ fontFamily: "Inter, sans-serif", color: "#6b6f5a" }}><b>UTORid:</b> {formData?.utorid}</Typography>
                            <Typography variant="body1" sx={{ fontFamily: "Inter, sans-serif", color: "#6b6f5a" }}><b>Name:</b> {formData?.name}</Typography>
                            <Typography variant="body1" sx={{ fontFamily: "Inter, sans-serif", color: "#6b6f5a" }}><b>Email:</b> {formData?.email}</Typography>
                            <Typography variant="body1" sx={{ fontFamily: "Inter, sans-serif", color: "#6b6f5a" }}>Note: Personal information can be updated later by managers.</Typography>
                        </Stack>
                    </>
                }
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                onConfirm={handleConfirmCreate}
                loading={processing}
            />
        </Container>
    );
}
