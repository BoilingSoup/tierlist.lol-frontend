import { CSSObject } from "@mantine/core";
import { CSSProperties } from "react";

export const displayNone: CSSObject = {
  display: "none",
};

const marginYAuto = {
  margin: "auto 0",
};

export const homeLinkStyle: CSSProperties = {
  ...marginYAuto,
  textDecoration: "none",
};

export const navbarSx = (): CSSObject => ({
  backgroundColor: "black",
  height: "64px",
  justifyContent: "space-between",
});

export const logoFlexSx = (): CSSObject => ({
  justifyContent: "center",
  alignItems: "center",
});

const navTextCSS: CSSObject = {
  color: "white",
  ...marginYAuto,
};

export const navLinkTextSx = (): CSSObject => ({
  ...navTextCSS,
});

export const logoTextSx = (): CSSObject => ({
  ...navTextCSS,
  fontSize: "1.5rem",
  paddingLeft: "1ch",
});

export const landingTierListContainerSx = (): CSSObject => ({
  position: "absolute",
  height: "80vh",
  width: "100%",
  zIndex: -1,
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
