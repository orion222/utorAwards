import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Alert } from "@mui/material";
import api from "../../api/api";

function DetailsTemplate({ queryKey, apiEndpoint, children }) {
    const { id } = useParams();
    
    const { data, isFetching, error, refetch } = useQuery({
        queryKey: [queryKey, id],
        queryFn: async () => {
            const response = await api.get(`${apiEndpoint}/${id}`);
            return response.data;
        },
        refetchOnWindowFocus: false,
        staleTime: 30 * 60 * 1000, // 30 minutes
    });

    if (isFetching) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
                <Alert severity="error">
                    An error occurred while fetching details. {error.response?.status === 403 ? "You do not have the clearance to see this page" : "Server error"}
                </Alert>
            </Box>
        );
    }

    return children(data, refetch);
}

export default DetailsTemplate;