import {
  Stack,
  Button
} from '@mui/material';

export default function SaveCancelButtons({onCancelChanges, onSaveChanges, isSaving, hasAnyChanges, pointChanges}) {
  if (!hasAnyChanges) return null;
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{mb: 2, justifyContent: "flex-end"}}
    >
      <Button
        variant="outlined"
        onClick={onCancelChanges}
        disabled={isSaving}
        size="small"
      >
        Cancel Changes
      </Button>
      <Button
        variant="contained"
        onClick={onSaveChanges}
        disabled={isSaving}
        size="small"
      >
        {isSaving ? "Saving..." : `Save Changes (${Object.keys(pointChanges).length})`}
      </Button>
    </Stack>
  );
}