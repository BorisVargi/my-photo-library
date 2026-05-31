import { Box, Typography } from '@mui/material';

type PageProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function Page({ title, subtitle, children }: PageProps) {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>

        {subtitle && (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {children}
    </Box>
  );
}
