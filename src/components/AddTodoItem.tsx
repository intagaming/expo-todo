/* eslint-disable react-native/no-color-literals */
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { definitions } from "../types/supabase";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFF",
    flexDirection: "row",
    padding: 20,
  },
  text: {
    flex: 1,
    marginLeft: 10,
  },
});

interface Props {
  onSubmit: (newTodo: Partial<definitions["todos"]>) => void;
}

export default function AddTodoItem({ onSubmit }: Props) {
  const [task, setTask] = useState<string>("");

  const handleSubmit = () => {
    onSubmit({ task });
    setTask("");
  };

  return (
    <View style={styles.container}>
      <AntDesign name="plus" size={24} color="black" />
      <TextInput
        style={styles.text}
        value={task}
        placeholder="Add a new task"
        onChangeText={(text) => {
          setTask(text);
        }}
        multiline
        blurOnSubmit
        onSubmitEditing={() => {
          handleSubmit();
        }}
      />
    </View>
  );
}
