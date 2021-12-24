import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

export const supabaseConfig = Constants.manifest?.extra?.supabase;

const supabase = createClient(supabaseConfig.url, supabaseConfig.publicKey, {
  localStorage: AsyncStorageLib,
});

export default supabase;
