import {
  Chip,
} from "@mui/material"
import CircleIcon from '@mui/icons-material/Circle';
export default function EventStatusChip({startTime, endTime, published}) {
  const hasEnded = new Date(endTime) < new Date();
  const isLive = new Date(startTime) < new Date() && !hasEnded;

  const commonChipProps = {
    width: 'fit-content',
    padding: '0 1rem',
    fontSize: 10,
    fontWeight: 'bold',
    border: '1px solid black',
  }
  if (isLive) {
    return (
      <Chip
        label="LIVE"
        size="small"
        sx={{
          ...commonChipProps,
          backgroundColor: "#ff4444",
          color: "white",
          "& .MuiChip-icon": {
            color: "#fff",
          },
        }}/>
    )
  }
  else if (hasEnded) {
    return (
      <Chip
        label="ENDED"
        size="small"
        sx={{
          ...commonChipProps,
        }}
      />
    )
  }
  else if (published) {
    return (
      <Chip
        label="PUBLISHED"
        size="small"
        sx={{
          ...commonChipProps,
          backgroundColor: "#dde5b6"
        }}
      />
    )
  }
  else if (!published) {
    return (
      <Chip
        label="DRAFT"
        size="small"
        sx={{
          ...commonChipProps,
          backgroundColor: "#a98467",
          color: 'white'
        }}
      />
    )
  }

}