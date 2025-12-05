import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormCard from "../../components/common/FormCard";
import { Box, Typography, Stack, Button } from "@mui/material";
import api from "../../api/api";
import { useToast } from "../../context/ToastContext.jsx";

export default function DeletePromotionForm({ promotion, onClose }) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    
    const deletePromotionMutation = useMutation({
        mutationFn: async () => {
            const res = await api.delete(`/promotions/${promotion.id}`);
            console.log("hi");
            return res.data;
        },
        onSuccess: () => {
            showToast("Delete successful", "success");
            queryClient.invalidateQueries({ queryKey: ['promotion-details', String(promotion.id)] });
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
            onClose();
        },
        onError: (error) => {
            console.log(error);
            showToast(`Error: ${error.message || 'Failed to delete promotion'}`, "error");
        }
    });

    return (
        <FormCard
            title={`Delete ${promotion.name}?`}
            width="40%"
            showClose={true}
            onClose={(e) => {
                e.stopPropagation();
                onClose();
            }}
            fullWidth={!!onClose}
            keepForm={true}
            children={
                <Box sx={{ mt: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Are you sure you want to delete <strong>{promotion.name}</strong>?
                </Typography>
                    <Stack direction="row" spacing={2} mt={3}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => deletePromotionMutation.mutate()}
                            disabled={deletePromotionMutation.isLoading}
                        >
                            {deletePromotionMutation.isLoading ? "Deleting..." : "Yes, Delete"}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            }
        />
    );
}