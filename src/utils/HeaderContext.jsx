// HeaderContext.jsx
import { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export const useHeader = () => useContext(HeaderContext);

export const HeaderProvider = ({ children }) => {
  const [headerExtras, setHeaderExtras] = useState(null);

  return (
    <HeaderContext.Provider value={{ headerExtras, setHeaderExtras }}>
      {children}
    </HeaderContext.Provider>
  );
};
