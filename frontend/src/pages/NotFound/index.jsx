import { Box, Typography } from '@mui/material';
import LandingBackground from '../../components/common/LandingBackground';

function NotFound() {
    return (
        <LandingBackground>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h3" fontWeight={600}>404 - Page Not Found</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>Uh oh! The page you are looking for does not exist.</Typography>
            </Box>            
        </LandingBackground>
    );
}

export default NotFound;