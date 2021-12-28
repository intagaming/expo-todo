import { Platform } from "react-native";

// eslint-disable-next-line import/prefer-default-export
export const isBrowser = () => Platform.OS === "web";
