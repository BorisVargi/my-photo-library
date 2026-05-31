import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

export function AppButton(props: ButtonProps) {
  return (
    <Button
      variant="contained"
      sx={{
        textTransform: 'none',
        borderRadius: 2,
        fontWeight: 600,
      }}
      {...props}
    />
  );
}
