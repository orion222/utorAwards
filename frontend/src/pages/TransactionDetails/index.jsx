import { useParams, useLocation } from "react-router-dom";
import TransactionItemCard from "../../components/common/TransactionItemCard.jsx";


function TransactionDetails() {
    const { transactionId } = useParams();
    const { state } = useLocation();

    return (
        <TransactionItemCard transaction={state.transaction} key={transactionId} hover={false}></TransactionItemCard>
    )
}

export default TransactionDetails;