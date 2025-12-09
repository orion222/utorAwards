import { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { purchaseSchema as schema } from "./constant.js";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import FormCard from "../../components/common/FormCard.jsx";
import api from "../../api/api";
import useToast from "../../components/common/hooks/useToast.jsx";
import LabeledField from "../../components/common/LabeledField.jsx";
import RedemptionCard from "../../components/common/RedemptionCard.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { useUser } from "../../context/UserContext";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useWallet } from "../../context/WalletContext";
import { useSearchParams } from "react-router-dom";

export default function ProcessRedemption() {
  const { showToast, ToastComponent } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { setRedemption } = useWallet();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("transactionId") || "";

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { data: transactionData } = useQuery({
    queryKey: ["redemption-details", selectedId],
    queryFn: () =>
      api.get(`/transactions/${selectedId}`).then(res => res.data),
    enabled: !!selectedId,
  });

  const processMutation = useMutation({
    mutationFn: () =>
      api.patch(`/transactions/${transactionData.id}/processed`, {
        processed: true,
      }),

    onSuccess: () => {
      queryClient.setQueryData(
        ["redemption-details", String(transactionData.id)],
        prev => ({
          ...prev,
          processed: true,
          processedBy: user.utorid,
        })
      );

      setRedemption(prev => ({
        ...prev,
        processed: true,
        processedBy: user.utorid,
        processedAt: new Date(),
      }));

      showToast("Redemption processed successfully", "success");

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["past-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },

    onError: (error) => {
      const errMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Redemption processing failed";

      const msg = (
        <Stack spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Redemption Failed
          </Typography>
          <Typography variant="body2">
            An error has occurred: {errMessage}
          </Typography>
          <Typography variant="body2">
            Please try again later.
          </Typography>
          <Typography variant="body2">
            If this error persists, please contact your manager.
          </Typography>
        </Stack>
      );

      showToast(msg, "error");
    },
  });

  const onSearch = async (data) => {
    const { transactionId } = data;

    try {
      const response = await api.get(`/transactions/${transactionId}`);
      const details = response.data;

      if (details.type !== "redemption") {
        showToast(
          "The provided Transaction ID does not correspond to a redemption.",
          "error"
        );
        return;
      }

      queryClient.setQueryData(
        ["redemption-details", String(details.id)],
        details
      );

      setSearchParams({ transactionId: details.id });

      reset(defaultValues);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Transaction search failed";

      showToast(message, "error");
    }
  };

  const handleProcessClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmClick = () => {
    if (!transactionData) return;
    setShowConfirmDialog(false);
    processMutation.mutate();
  };

  const defaultValues = { transactionId: "" };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues,
  });

  return (
    <>
      <Typography variant="h4" pb={1}>
        Process Redemption
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Enter Transaction ID to process redemption requests
      </Typography>

      <FormCard>
        <form onSubmit={handleSubmit(onSearch)}>
          <Stack spacing={2}>
            <Box component="h3">Search for a redemption to process:</Box>

            <LabeledField label="Transaction ID" required>
              <Controller
                name="transactionId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ex: 123"
                    error={!!errors.transactionId}
                    helperText={errors.transactionId?.message}
                  />
                )}
              />
            </LabeledField>

            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Search Redemption"}
            </Button>
          </Stack>
        </form>

        {ToastComponent}
      </FormCard>

      {transactionData && (
        <>
          <RedemptionCard
            redemption={transactionData}
            onProcess={handleProcessClick}
            processing={processMutation.isPending}
          />

          <ConfirmDialog
            open={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
            title="Confirm Process Redemption"
            description={
              <Stack spacing={2} sx={{ p: 1 }}>
                <Typography color="text.secondary">
                  Are you sure you want to process this redemption?
                </Typography>
                <Typography color="text.secondary">
                  Transaction ID: {transactionData.id}
                </Typography>
                <Typography color="text.secondary">
                  This action cannot be undone.
                </Typography>
              </Stack>
            }
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            onConfirm={handleConfirmClick}
            loading={processMutation.isPending}
          />
        </>
      )}
    </>
  );
}