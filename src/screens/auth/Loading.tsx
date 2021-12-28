import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default function Loading() {
  return (
    <View style={styles.container}>
      <Text>Loading</Text>
    </View>
  );
}
