import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormCard from "../../components/common/FormCard";
import { 
  Box, 
  Typography, 
  Stack, 
  Button, 
  Alert,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import { 
  DeleteForever as DeleteIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  LocalOffer as PromotionIcon
} from "@mui/icons-material";
import api from "../../api/api";
import { useToast } from "../../context/ToastContext.jsx";
import { useNavigate } from "react-router-dom";

export default function DeletePromotionForm({ promotion, onClose }) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    const deletePromotionMutation = useMutation({
        mutationFn: async () => {
            const res = await api.delete(`/promotions/${promotion.id}`);
            return res.data;
        },
        onSuccess: () => {
            showToast("Delete successful", "success");
            queryClient.invalidateQueries({ queryKey: ['promotion-details', String(promotion.id)] });
            onClose();
            navigate(-1);
        },
        onError: (error) => {
            showToast(`Error: ${error.message || 'Failed to delete promotion'}`, "error");
        }
    });

    return (
        <FormCard
            title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <WarningIcon sx={{ color: 'error.main', fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="600" color="error.main">
                        Delete
                    </Typography>
                </Box>
            }
            width={{ xs: '95%', sm: '85%', md: '45%' }}
            onClose={(e) => {
                e.stopPropagation();
                onClose();
            }}
            keepForm={true}
            children={
                <Box sx={{ mt: 2 }}>
                    {/* Promotion Info Card */}
                    <Box 
                        sx={{ 
                            p: { xs: 2, sm: 3 }, 
                            mb: 3,
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 2,
                            bgcolor: 'grey.50',
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1.5, sm: 2 },
                            flexDirection: { xs: 'column', sm: 'row' },
                            textAlign: { xs: 'center', sm: 'left' }
                        }}
                    >
                        <PromotionIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                                {promotion.name}
                            </Typography>
                            {promotion.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    📝 {promotion.description}
                                </Typography>
                            )}
                            {promotion.multiplier && (
                                <Typography variant="body2" color="text.secondary">
                                    ✨ {promotion.multiplier}x Points Multiplier
                                </Typography>
                            )}
                        </Box>
                        <Chip 
                            label="Promotion" 
                            color="secondary" 
                            variant="outlined" 
                            size="small"
                        />
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Warning Alert */}
                    <Alert 
                        severity="error" 
                        icon={<WarningIcon />}
                        sx={{ mb: 3 }}
                    >
                        <Typography variant="body1" fontWeight="500">
                            This action cannot be undone!
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Deleting this promotion will permanently remove all associated data, 
                            including user promotion history and bonus points.
                        </Typography>
                    </Alert>

                    {/* Confirmation Text */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="body1" color="text.primary">
                            Are you sure you want to permanently delete
                        </Typography>
                        <Typography 
                            variant="h6" 
                            fontWeight="700" 
                            color="error.main"
                            sx={{ mt: 1, mb: 1 }}
                        >
                            "{promotion.name}"?
                        </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={2} 
                        sx={{ mt: 4 }}
                        justifyContent="center"
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            startIcon={<CancelIcon />}
                            onClick={onClose}
                            sx={{ 
                                minWidth: 140,
                                py: 1.5,
                                fontWeight: 600,
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                    transform: 'translateY(-1px)',
                                    transition: 'all 0.2s ease-in-out'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="large"
                            startIcon={
                                deletePromotionMutation.isPending ? (
                                    <CircularProgress size={16} color="inherit" />
                                ) : (
                                    <DeleteIcon />
                                )
                            }
                            onClick={() => deletePromotionMutation.mutate()}
                            disabled={deletePromotionMutation.isPending}
                            sx={{ 
                                minWidth: 140,
                                py: 1.5,
                                fontWeight: 600,
                                boxShadow: 2,
                                '&:hover': {
                                    boxShadow: 4,
                                    transform: 'translateY(-1px)',
                                    transition: 'all 0.2s ease-in-out'
                                }
                            }}
                        >
                            {deletePromotionMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </Stack>
                </Box>
            }
        />
    );
}