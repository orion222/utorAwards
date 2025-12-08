import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "../../context/ToastContext";
import FormCard from "../../components/common/FormCard";
import { useForm, Controller } from "react-hook-form";
import {
  Stack,
  TextField,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { yupResolver } from "@hookform/resolvers/yup";
import { adjustmentSchema } from "./constants";
import api from "../../api/api";
import { useUser } from "../../context/UserContext";

function CreateAdjustmentForm({ transaction, onClose }) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { user } = useUser();

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(adjustmentSchema),
        defaultValues: {
            amount: "",
            promotionIdInput: "",
            promotionIds: [],
            remark: ""
        }
    });

    const promotionIds = watch("promotionIds");
    const promotionIdInput = watch("promotionIdInput");

    const handleAddPromotionId = () => {
        const id = promotionIdInput.trim();
        if (!id) return;

        // avoid duplicates
        if (!promotionIds.includes(id)) {
            setValue("promotionIds", [...promotionIds, id]);
        }

        setValue("promotionIdInput", "");
    };

    const handleDeletePromotionId = (idToRemove) => {
        setValue("promotionIds", promotionIds.filter((id) => id !== idToRemove));
    };

    const createAdjustmentMutation = useMutation({
        mutationFn: async (formData) => {
            const payload = {
                ...formData,
                utorid: transaction.utorid,
                type: "adjustment",
                relatedId: transaction.id,
            }
            const res = await api.post("/transactions", payload);
            return res.data;
        },
        onSuccess: () => {
            showToast("Successfully created an adjustment!", "success");
            if (transaction.utorid === user.utorid) {
                queryClient.invalidateQueries({ queryKey: ["user"] });
                queryClient.invalidateQueries({ queryKey: ["past-transactions"] });
                queryClient.invalidateQueries({ queryKey: ["transactions"] });
            }
            else {
                queryClient.invalidateQueries({ queryKey: ["user-details", String(transaction.user?.id)] });
            }
            queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["all-users"] });
            onClose();
        }, 
        onError: (error) => {
            console.log(error)
            const message =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to update profile";
            showToast(message, "error");
        }
    });

    const onSubmit = (data) => {
        delete data.promotionIdInput;
        createAdjustmentMutation.mutate(data);
    };

    return (
        <FormCard
            width="40%"
            onClose={(e) => {
                e.stopPropagation();
                onClose();
            }}
            fullWidth={!!onClose}
            keepForm={true}
            showClose={true}
        >
            <Typography variant="h5" fontWeight="bold">Create an adjustment for transaction #{transaction.id}</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3} mt={3}>

                <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="number"
                            label="Amount"
                            fullWidth
                            error={!!errors.amount}
                            helperText={errors.amount?.message}
                        />
                    )}
                />

                <Stack direction="row" spacing={1}>
                    <Controller
                    name="promotionIdInput"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="number"
                            label="Add Promotion ID"
                            fullWidth
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddPromotionId();
                                }
                            }}
                        />
                    )}
                    />

                    <Button
                        variant="contained"
                        onClick={handleAddPromotionId}
                        startIcon={<AddIcon />}
                    >
                        Add
                    </Button>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {promotionIds.map((id) => (
                        <Chip
                            key={id}
                            label={id}
                            onDelete={() => handleDeletePromotionId(id)}
                            variant="outlined"
                        />
                    ))}
                </Stack>

                <Controller
                    name="remark"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Remark"
                            multiline
                            minRows={2}
                            fullWidth
                        />
                    )}
                />

                {/* Submit */}
                <Button variant="contained" color="primary" type="submit">
                    Submit Adjustment
                </Button>
                </Stack>
            </form>
        </FormCard>
    );
}

export default CreateAdjustmentForm;