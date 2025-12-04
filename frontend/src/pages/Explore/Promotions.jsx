import {Alert, AlertTitle, Box, CircularProgress, Typography, Button, useTheme, Modal, useMediaQuery} from "@mui/material";
import FilterableList from "../../components/common/FilterableList.jsx";
import PromotionCard from "../../components/common/PromotionCard.jsx";
import { useUser } from "../../context/UserContext.jsx";
import CreatePromotionForm from "./CreatePromotionForm.jsx";
import { useState, useEffect } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Promotions() {
  const theme = useTheme();
  const { user } = useUser();
  const [ createModal, setCreateModal ] = useState(false);
  const isSmall = useMediaQuery("(max-width: 670px)");

  const filterConfig = {
    name: {
      type: "text",
      label: "Name",
    },
    started: {
      type: "select",
      label: "Started",
      options: ["True", "False"],
      exclusiveWith: ["ended"],
    },
    ended: {
      type: "select",
      label: "Ended",
      options: ["True", "False"],
      exclusiveWith: ["started"],
    },
    type: {
      type: "select",
      label: "Type",
      options: ["Automatic", "Onetime"],
    }
  }

  if (user.role === "manager" || user.role === "superuser") {
    filterConfig.available = {
      type: "select",
      label: "Available",
      options: ["True", "False"],
    }
  }

  const orderByConfig = [
    { label: "Start Time (Earliest)", value: "startTime_asc" },
    { label: "Start Time (Latest)", value: "startTime_desc" },
    { label: "End Time (Earliest)", value: "endTime_asc" },
    { label: "End Time (Latest)", value: "endTime_desc" },
    { label: "Points (Lowest)", value: "points_asc" },
    { label: "Points (Highest)", value: "points_desc" },
    { label: "Minimum Spending (Lowest)", value: "minSpending_asc" },
    { label: "Minimum Spending (Highest)", value: "minSpending_desc" },
    { label: "Discount Rate (Lowest)", value: "rate_asc" },
    { label: "Discount Rate (Highest)", value: "rate_desc" },
  ];

  return (
    <Box sx={{ my: 2 }}>
       {["manager", "superuser"].includes(user.role) && (
          <Button
              onClick={(e) => {
                  e.stopPropagation();
                  setCreateModal(true)
              }}
              sx={{
                  fontSize: 12,
                  color: "grey",
                  borderRadius: "8px",
                  width: "fit-content",
                  "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
              startIcon={<AddCircleOutlineIcon sx={{color:"grey",fontSize:12}} />}
          >
              Create Promotion 
              
          </Button>                           
      )}
      <Modal
        open={createModal}
        onClose={(e) => {
            e.stopPropagation();
            setCreateModal(false)
        }}
        sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
        }}
    >
        <Box sx={{width: isSmall ? "100%":"50%"}}>
            <CreatePromotionForm
                onClose={() => setCreateModal(false)}      
            />
        </Box>
      </Modal>
      <FilterableList queryKey="promotions" apiEndpoint="/promotions" filterConfig={filterConfig} orderByConfig={orderByConfig}>
        {({ data, isFetching, error }) => {
          if (error) {
            return (
              <Box display="flex" justifyContent="center" p={4}>
                <Alert severity="error">
                  <AlertTitle severity="error">Error</AlertTitle>
                  Something went wrong while fetching your transactions. Your filters may be invalid. Try again later.
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
                    gap: 2,
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