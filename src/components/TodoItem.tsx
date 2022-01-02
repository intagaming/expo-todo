/* eslint-disable react-native/no-color-literals */
import { AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { definitions } from "../types/supabase";

const THRESHOLDS = {
  activate: -100,
  pending: -80,
};

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
    position: "absolute",
    right: 0,
    width: "100%",
  },
  deleteIconContainer: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: Math.abs(THRESHOLDS.pending),
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

  const offsetX = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }],
  }));

  const startX = useSharedValue(0);
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      offsetX.value = e.translationX + startX.value;
    })
    .onEnd(() => {
      if (offsetX.value < THRESHOLDS.activate) {
        if (onDelete) runOnJS(onDelete)();
      } else if (offsetX.value < THRESHOLDS.pending) {
        offsetX.value = withSpring(THRESHOLDS.pending);
        startX.value = THRESHOLDS.pending;
      } else {
        offsetX.value = withSpring(0);
        startX.value = 0;
      }
    })
    .activeOffsetX([-20, 20]);

  const inputRef = useRef<TextInput | null>(null);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.taskItem, animatedStyles]}>
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
              ref={inputRef}
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
      </GestureDetector>
      <View style={styles.delete}>
        <View style={styles.deleteIconContainer}>
          <AntDesign name="delete" size={24} color="white" />
        </View>
      </View>
    </View>
  );
}

TodoItem.defaultProps = {
  onChange: undefined,
  onDelete: undefined,
};
