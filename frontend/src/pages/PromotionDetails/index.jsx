import { useParams, useLocation } from "react-router-dom";
import PromotionCard from "../../components/common/PromotionCard";


function PromotionDetails() {
    const { promotionId } = useParams();
    const { state } = useLocation();

    return (
        <PromotionCard promotion={state.promotion} key={promotionId} hover={false}></PromotionCard>
    )
}

export default PromotionDetails;