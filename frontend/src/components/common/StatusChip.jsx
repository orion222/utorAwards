import {
  Chip,
} from '@mui/material';

export default function StatusChip({ sx, ...props }) {
  const commonChipProps = {
    width: 'fit-content',
    padding: '0 1rem',
    fontSize: 10,
    fontWeight: 'bold',
    border: '1px solid black',
  }

  return (
    <Chip
      sx={{...commonChipProps, ...sx}}
      {...props}
    />
  )
}