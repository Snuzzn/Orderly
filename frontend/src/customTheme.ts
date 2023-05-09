import { createTheme } from "baseui";
const primitives = {
  primary: "#F19164",
  primary600: "#DB6D3A",
  primary700: "#DB6D3A",
  primaryFontFamily: 'wotfardregular',
  fontFamily: 'wotfardregular',
};

const overrides = {
  colors: {
    borderSelected: "#F19164",
    accent: "#F19164", // hot pink
    sliderHandleFill:"#F19164",
    sliderHandleInnerFill:"#F19164",
    tagNeutralSolidBackground:"#F19164" 
  },
};
export const customTheme = createTheme(primitives, overrides);
