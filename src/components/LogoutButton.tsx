import { Pressable, Text } from "react-native";
import supabase from "../lib/supabase";

function LogoutButton() {
  return (
    <Pressable
      onPress={() => {
        supabase.auth.signOut();
      }}
    >
      <Text>Logout</Text>
    </Pressable>
  );
}

export default LogoutButton;
