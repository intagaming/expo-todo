/* eslint-disable react-native/no-color-literals */
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { definitions } from "../types/supabase";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFF",
    flex: 1,
    flexDirection: "row",
    padding: 20,
  },
  text: {
    flex: 1,
    marginLeft: 10,
  },
});

interface Props {
  todo: definitions["todos"];
  onChange: (newTodo: Partial<definitions["todos"]>) => void;
}

export default function TodoItem({ todo, onChange }: Props) {
  const [checked, setChecked] = useState<boolean>(todo.is_complete ?? false);
  const [task, setTask] = useState<string>(todo.task ?? "");
  const [taskBuffer, setTaskBuffer] = useState<string>(task);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (taskBuffer === task) return;
      onChange({
        id: todo.id,
        task: taskBuffer,
      });
      setTask(taskBuffer);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [taskBuffer]);

  return (
    <View style={styles.container}>
      <Checkbox
        value={checked}
        onValueChange={(value) => {
          onChange({ id: todo.id, is_complete: value });
          setChecked(value);
        }}
      />
      <TextInput
        style={styles.text}
        value={taskBuffer}
        onChangeText={(text) => {
          setTaskBuffer(text);
        }}
        multiline
      />
    </View>
  );
}
