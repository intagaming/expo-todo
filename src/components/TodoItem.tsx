/* eslint-disable react-native/no-color-literals */
import { AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { definitions } from "../types/supabase";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  delete: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    flexDirection: "row",
    height: "100%",
    justifyContent: "flex-end",
    width: "100%",
  },
  deleteIcon: {
    marginRight: 30,
  },
  taskItem: {
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    padding: 20,
    zIndex: 1,
  },
  text: {
    flex: 1,
    marginHorizontal: 10,
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
  const [editing, setEditing] = useState<boolean>(false);

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
    <Swipeable
      renderRightActions={() => (
        <RectButton style={styles.delete}>
          <AntDesign
            style={styles.deleteIcon}
            name="delete"
            size={24}
            color="white"
          />
        </RectButton>
      )}
      rightThreshold={41}
      onSwipeableRightOpen={() => {
        if (onDelete) onDelete();
      }}
    >
      <View style={styles.container}>
        <Animated.View style={styles.taskItem}>
          <Checkbox
            value={todo.is_complete}
            onValueChange={(value) => {
              if (onChange) {
                onChange({ id: todo.id, is_complete: value });
              }
            }}
          />
          {!editing && (
            <Text
              style={styles.text}
              onPress={() => {
                setEditing(true);
              }}
            >
              {todo.task}
            </Text>
          )}
          {editing && (
            <TextInput
              style={styles.text}
              value={taskBuffer}
              onChangeText={(text) => {
                setTaskBuffer(text);
              }}
              multiline
              onBlur={() => {
                setEditing(false);
              }}
              autoFocus
            />
          )}
        </Animated.View>
      </View>
    </Swipeable>
  );
}

TodoItem.defaultProps = {
  onChange: undefined,
  onDelete: undefined,
};
