import StatusChip from '../../components/common/StatusChip.jsx';
export default function EventStatusChip({startTime, endTime, published}) {
  const hasEnded = new Date(endTime) < new Date();
  const isLive = new Date(startTime) < new Date() && !hasEnded;

  if (!published) {
    return (
      <StatusChip
        label="DRAFT"
        sx={{
          backgroundColor: "#a98467",
          color: 'white'
        }}
      />
    )
  }
  if (isLive) {
    return (
      <StatusChip
        label="LIVE"
        sx={{
          backgroundColor: "#ff4444",
          color: "white",
        }}/>
    )
  }
  else if (hasEnded) {
    return (
      <StatusChip
        label="ENDED"
      />
    )
  }
  else if (published) {
    return (
      <StatusChip
        label="PUBLISHED"
        sx={{
          backgroundColor: "#dde5b6"
        }}
      />
    )
  }

}