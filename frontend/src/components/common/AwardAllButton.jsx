import React, { useState } from 'react';
import {
  Stack,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';

export default function AwardAllButton({ onAwardAll, data, isSaving }) {
  const [awardAmount, setAwardAmount] = useState('');
  const [showInput, setShowInput] = useState(false);
  const isSmall = useMediaQuery('(max-width: 500px)');
  const handleAwardClick = () => {
    setShowInput(true);
  };

  const handleConfirmAward = () => {
    const amount = parseInt(awardAmount);
    if (!isNaN(amount) && amount !== 0 && data.length > 0) {
      onAwardAll(amount, data);
      setAwardAmount('');
      setShowInput(false);
    }
  };

  const handleCancel = () => {
    setAwardAmount('');
    setShowInput(false);
  };

  if (!showInput) {
    return (
      <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleAwardClick}
          disabled={isSaving || data.length === 0}
          size="small"
        >
          Award All ({data.length} guests)
        </Button>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: "flex-end", alignItems: "center" }}>
      <TextField
        value={awardAmount}
        onChange={(e) => setAwardAmount(e.target.value)}
        placeholder="Enter points"
        size="small"
        type="number"
        sx={{ width: 120 }}
        autoFocus
      />
      <Button
        variant="outlined"
        onClick={handleCancel}
        disabled={isSaving}
        size="small"
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleConfirmAward}
        disabled={isSaving || !awardAmount.trim()}
        size="small"
      >
        {isSmall ? "Award" : "Confirm Award"}
      </Button>
    </Stack>
  );
}
