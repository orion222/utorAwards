import {
  Chip,
} from '@mui/material';

export default function StatusChip({ sx, ...props }) {
  const commonChipProps = {
    width: 'fit-content',
    fontSize: 10,
    fontWeight: 'bold',
    border: '1px solid #adb5bd',
    size: 'small',
  }

  return (
    <Chip
      sx={{...commonChipProps, ...sx}}
      {...props}
    />
  )
}