import {Alert, AlertTitle, Box, CircularProgress, Typography} from "@mui/material";
import FilterableList from "../../components/common/FilterableList.jsx";
import EventCard from "../../components/common/EventCard.jsx";
import PromotionCard from "../../components/common/PromotionCard.jsx";

function Promotions() {

  const filterConfig = {
    name: {
      type: "text",
      label: "Name",
    },
    started: {
      type: "select",
      label: "Type",
      options: ["Automatic", "Onetime"],
    }
  }

  return (
    <Box sx={{ my: 2 }}>
      <FilterableList queryKey="promotions" apiEndpoint="/promotions" filterConfig={filterConfig}>
        {({ data, isFetching, error }) => {
          if (error) {
            return (
              <Box display="flex" justifyContent="center" p={4}>
                <Alert>
                  <AlertTitle>Error</AlertTitle>
                  Something went wrong while fetching your transactions. Try again later.
                </Alert>
              </Box>
            )
          }

          if (isFetching) {
            return (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            );
          }

          return (
            <>
              {data.length === 0 ? (
                <Box>
                  <Typography variant="body2" color="textSecondary">No results found</Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "100%",
                    display: "grid",
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 1,
                  }}
                >
                  {data.map(promo => (
                    <PromotionCard promotion={promo} key={promo.id} />
                  ))}
                </Box>
              )}
            </>
          )
        }}
      </FilterableList>
    </Box>
  );
}

export default Promotions;