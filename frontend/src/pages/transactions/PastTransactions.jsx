import {Box, CircularProgress, Typography} from "@mui/material";
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


  return (
    <>
      <Typography variant="h5">Past Transactions</Typography>
      <Box sx={{ my: 2 }}>
        <FilterableList queryKey="past-transactions" apiEndpoint="/users/me/transactions" filterConfig={filterConfig}>
          {({data, isLoading, totalCount}) => {
            return isLoading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
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