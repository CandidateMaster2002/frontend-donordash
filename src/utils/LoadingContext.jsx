// import React, { createContext, useState, useContext } from 'react';

// const LoadingContext = createContext();

// export const useLoading = () => useContext(LoadingContext);

// export const LoadingProvider = ({ children }) => {
//   const [loading, setLoading] = useState(false);

//   const showLoader = () => setLoading(true);
//   const hideLoader = () => setLoading(false);

//   return (
//     <LoadingContext.Provider value={{ loading, showLoader, hideLoader }}>
//       {children}
//     </LoadingContext.Provider>
//   );
// };

// LoadingContext.jsx
import React, { createContext, useContext, useState, useMemo } from "react";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  // counters
  const [fullscreenCount, setFullscreenCount] = useState(0);
  // scoped inline counters map: scope -> count
  const [inlineMap, setInlineMap] = useState({});

  const showLoader = (mode = "fullscreen", scope = "default") => {
    if (mode === "fullscreen") setFullscreenCount((c) => c + 1);
    if (mode === "inline")
      setInlineMap((m) => ({ ...m, [scope]: (m[scope] || 0) + 1 }));
  };

  const hideLoader = (mode = "fullscreen", scope = "default") => {
    if (mode === "fullscreen") setFullscreenCount((c) => Math.max(0, c - 1));
    if (mode === "inline")
      setInlineMap((m) => {
        const v = (m[scope] || 0) - 1;
        const copy = { ...m };
        if (v <= 0) delete copy[scope];
        else copy[scope] = v;
        return copy;
      });
  };

  const value = useMemo(
    () => ({
      isFullscreen: fullscreenCount > 0,
      inlineMap,
      showLoader,
      hideLoader,
    }),
    [fullscreenCount, inlineMap]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};
