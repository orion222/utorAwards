import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from './UserContext.jsx';
const WalletContext = createContext({
  redemptionData: null,
  setRedemption: (data) => {},
});
export const WalletProvider = ({ children }) => {
  const { addResetContextFunction, removeResetContextFunction } = useUser();
  const [redemptionData, setRedemptionData] = useState(null);
  const setRedemption = (data) => {
    setRedemptionData(data);
  };
  
  const resetWallet = useCallback(() => {
    setRedemptionData(null);
  }, []);

  useEffect(() => {
    addResetContextFunction(resetWallet);
    return () => {
      removeResetContextFunction(resetWallet);
    };
  }, [addResetContextFunction, removeResetContextFunction, resetWallet]);

  return (
    <WalletContext.Provider value={{ redemptionData, setRedemption }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
