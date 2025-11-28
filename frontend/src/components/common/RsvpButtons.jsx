import { Stack, Button } from "@mui/material";

function RsvpButtons({ rsvp, onAccept, onDecline }) {

  return (
    <Stack direction="row" spacing={1}>
      {!rsvp && (<Button
        variant={"contained"}
        color="success"
        onClick={onAccept}
      >
        RSVP
      </Button>)}

      {rsvp && (<Button
        variant={"contained"}
        color="error"
        onClick={onDecline} 
      >
        Cancel RSVP
      </Button>)}
    </Stack>
  );
}

export default RsvpButtons;