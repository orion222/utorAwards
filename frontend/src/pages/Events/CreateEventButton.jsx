import {Box, Button} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";


export default function CreateEventButton({onClick}){
  return (
    <Box display="flex" justifyContent="flex-end" width='100%'>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={onClick}
        variant='contained'
        sx={{ mb: 2 }}
      >
        Create Event
      </Button>
    </Box>
  );
}