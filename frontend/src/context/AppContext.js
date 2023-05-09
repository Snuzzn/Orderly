import { createContext } from "react";
import React from "react";
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cartItems, setCartItems] = React.useState([]);
  const [priceRange, setPriceRange] = React.useState([0, 80]);
  const [prepareTimeRange, setPrepareTimeRange] = React.useState([0, 60]);
  const [isVegetarian, setIsVegetarian] = React.useState(false);
  const [isVegan, setIsVegan] = React.useState(false);
  const [isFilterOn, setIsFilterOn] = React.useState(false);

  return (
    <AppContext.Provider
      value={{
        cartItems,
        setCartItems,
        priceRange,
        setPriceRange,
        prepareTimeRange,
        setPrepareTimeRange,
        isVegetarian,
        setIsVegetarian,
        isVegan,
        setIsVegan,
        isFilterOn,
        setIsFilterOn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
