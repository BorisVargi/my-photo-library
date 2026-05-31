import { Paper } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

type Props = {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  onClick?: () => void;
};

export function Card({ children, sx, onClick }: Props) {
  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 18px 44px rgba(0,0,0,0.1)',
        },
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}
