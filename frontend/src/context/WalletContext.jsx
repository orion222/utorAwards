import { createContext, useContext, useState } from "react";

const WalletContext = createContext({
  redemptionData: null,
  setRedemption: (data) => {},
});
export const WalletProvider = ({ children }) => {
  const [redemptionData, setRedemptionData] = useState(null);
  const setRedemption = (data) => {
    setRedemptionData(data);
  };
  console.log("in context: ", redemptionData);
  return (
    <WalletContext.Provider value={{ redemptionData, setRedemption }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
