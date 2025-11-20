import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transferSchema as schema } from "./constants.js";
import { Stack, Box, TextField, Button, TextareaAutosize } from "@mui/material";
import FormCard from "../../common/FormCard.jsx";
import api from "../../../api/api";
import useToast from "../../common/hooks/useToast.jsx";
import HandshakeTwoToneIcon from "@mui/icons-material/HandshakeTwoTone";
export default function TransferPoints() {
  const { showToast, ToastComponent } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      userid: "",
      amount: "",
      remarks: "",
    },
  });

  const onSubmit = async (data) => {
    const { userid, amount, remarks } = data;

    const payload = {
      type: "transfer",
      amount: Number(amount),
      remark: remarks || "",
    };

    try {
      const response = await api.post(`/users/${userid}/transactions`, payload);
      showToast("Transfer successful", "success");
      reset();
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Transfer failed";
      showToast(msg, "error");
    }
  };

  return (
    <FormCard
      children={
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Box
                component="h2"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                Send Points <HandshakeTwoToneIcon />
              </Box>

              <Controller
                name="userid"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Recipient User ID"
                    variant="outlined"
                    error={!!errors.userid}
                    helperText={errors.userid?.message}
                  />
                )}
              />

              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount"
                    variant="outlined"
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                  />
                )}
              />

              <Controller
                name="remarks"
                control={control}
                render={({ field }) => (
                  <TextareaAutosize
                    {...field}
                    minRows={3}
                    placeholder="Remarks (optional)"
                    style={{
                      padding: 12,
                      fontFamily: "inherit",
                      fontSize: "1rem",
                      borderRadius: 4,
                      border: errors.remarks
                        ? "1px solid #d32f2f"
                        : "1px solid #ccc",
                    }}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Transferring..." : "Transfer"}
              </Button>
            </Stack>
          </form>
          {ToastComponent}
        </>
      }
    />
  );
}
