/* eslint-disable react-native/no-color-literals */
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
  onChange?: (newTodo: Partial<definitions["todos"]>) => void;
  onDelete?: () => void;
}

export default function TodoItem({ todo, onChange, onDelete }: Props) {
  const [task, setTask] = useState<string>(todo.task ?? "");
  const [taskBuffer, setTaskBuffer] = useState<string>(task);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (taskBuffer === task) return;
      if (onChange) {
        onChange({
          id: todo.id,
          task: taskBuffer,
        });
      }
      setTask(taskBuffer);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [taskBuffer]);

  return (
    <View style={styles.container}>
      <Checkbox
        value={todo.is_complete}
        onValueChange={(value) => {
          if (onChange) {
            onChange({ id: todo.id, is_complete: value });
          }
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
      <Pressable
        onPress={() => {
          if (onDelete) {
            onDelete();
          }
        }}
      >
        <Text>Delete</Text>
      </Pressable>
    </View>
  );
}

TodoItem.defaultProps = {
  onChange: undefined,
  onDelete: undefined,
};
