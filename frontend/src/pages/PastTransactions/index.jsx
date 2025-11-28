import {Alert, AlertTitle, Box, CircularProgress, Typography} from "@mui/material";
import FilterableList from "../../components/common/FilterableList.jsx";
import TransactionItemCard from "../../components/common/TransactionItemCard.jsx";

function PastTransactions() {
  const filterConfig = {
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
      <Typography variant="h4">Past Transactions</Typography>
      <Box sx={{ my: 2 }}>
        <FilterableList queryKey="past-transactions" apiEndpoint="/users/me/transactions" filterConfig={filterConfig} orderByConfig={orderByConfig}>
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

export default PastTransactions;