import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../context/ToastContext";
import FormCard from "../../components/common/FormCard";
import {
  Stack,
  Typography,
  Button,
  Box,
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import api from "../../api/api";

function ToggleSuspiciousForm({ transaction, onClose }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const res = await api.patch(`/transactions/${transaction.id}/suspicious`, {
        suspicious: !transaction.suspicious, 
      });
      return res.data;
    },
    onSuccess: () => {
      showToast(
        transaction.suspicious
          ? "Suspicion cleared successfully!"
          : "Transaction marked as suspicious.",
        "success"
      );

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-details", String(transaction.id)] });
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["past-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user-details", String(transaction.user?.id)] });
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      onClose();
    },
    onError: (error) => {
        console.log(error);
      showToast("Failed to update suspicious status.", "error");
    },
  });

  const handleConfirm = () => {
    toggleMutation.mutate();
  };

  return (
    <FormCard
      width="32%"
      onClose={(e) => {
        e.stopPropagation();
        onClose();
      }}
      fullWidth={!!onClose}
      keepForm={true}
    >
      <Stack spacing={3}>

        <Stack direction="row" spacing={1} alignItems="center">
          <ReportProblemIcon color="error" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold">
            {transaction.suspicious
              ? "Clear Suspicion"
              : "Mark as Suspicious"}
          </Typography>
        </Stack>

        <Typography fontSize={15} color="text.secondary">
            {transaction.suspicious
                ? `Are you sure you want to clear the suspicion from transaction #${transaction.id}?`
                : `Are you sure you want to mark transaction #${transaction.id} as suspicious?
            `}
        </Typography>

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={1}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={toggleMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
            disabled={toggleMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            {transaction.suspicious ? "Clear" : "Confirm"}
          </Button>
        </Stack>
      </Stack>
    </FormCard>
  );
}

export default ToggleSuspiciousForm;