import {Alert, AlertTitle, Box, CircularProgress, Typography} from "@mui/material";
import FilterableList from "../../components/common/FilterableList.jsx";
import TransactionItemCard from "../../components/common/TransactionItemCard.jsx";

function AllTransactions() {
  const filterConfig = {
    name: {
        type: "text",
        label: "Name",
    },
    createdBy: {
        type: "text",
        label: "Created By",
    },
    suspicious: {
        type: "select",
        label: "Suspicious",
        options: ["True", "False"],
    },
    type: {
      type: "select",
      label: "Type",
      options: ["Purchase", "Redemption", "Adjustment", "Event", "Transfer"]
    },
    relatedId: {
      type: "number",
      label: "Related ID",
      dependsOn: "type",
      min: 0,
      max: 99999,
    },
    promotionId: {
      type: "number",
      label: "Promotion ID"
    },
    amount: {
      type: "number",
      label: "Amount",
    },
    operator: {
      type: "select",
      label: "Operator",
      // optional dependency
      dependsOn: "amount",
      options: ["gte", "lte"],
    },
  };

  const orderByConfig = [
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
    { label: "Date (Newest)", value: "createdAt_desc" },
    { label: "Date (Oldest)", value: "createdAt_asc" },
    { label: "Points (Highest)", value: "amount_desc" },
    { label: "Points (Lowest)", value: "amount_asc" },
    { label: "Money Spent (Highest)", value: "spent_desc" },
    { label: "Money Spent (Lowest)", value: "spent_asc" },
    { label: "Type (A-Z)", value: "type_asc" },
    { label: "Type (Z-A)", value: "type_desc" },
  ];


  return (
    <>
      <Box sx={{ my: 2 }}>
        <FilterableList queryKey="all-transactions" apiEndpoint="/transactions" filterConfig={filterConfig} orderByConfig={orderByConfig} limit={3}>
          {({ data, isFetching, error }) => {
            if (error) {
              return (
                <Box display="flex" justifyContent="center" p={4}>
                  <Alert>
                    <AlertTitle>Error</AlertTitle>
                    Something went wrong while fetching all transactions. Try again later.
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
                  <>
                    {data.map((transaction) => (
                      <TransactionItemCard transaction={transaction} key={transaction.id} />
                    ))}
                  </>
                )}
              </>
            )
          }}
        </FilterableList>
      </Box>
    </>
  );
}

export default AllTransactions;