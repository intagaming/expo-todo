import { useMemo } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AddTodoItem from "../components/AddTodoItem";
import TodoItem from "../components/TodoItem";
import useTodoDelete from "../hooks/useTodoDelete";
import useTodoMutation from "../hooks/useTodoMutation";
import useTodosQuery from "../hooks/useTodosQuery";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
});

function Todo() {
  const { data, error, isLoading, hasNextPage, fetchNextPage } =
    useTodosQuery();

  const todos = useMemo(
    () => data && data.pages.flatMap((page) => page.todos),
    [data]
  );

  const todoMutation = useTodoMutation();
  const todoDelete = useTodoDelete();

  return (
    <GestureHandlerRootView style={styles.container}>
      {isLoading && <Text>Please wait...</Text>}
      {error && <Text>{error.message}</Text>}
      {todos && todos.length === 0 && <Text>List is empty.</Text>}
      {todos && (
        <>
          <FlatList
            style={styles.list}
            data={todos}
            renderItem={({ item }) => (
              <TodoItem
                key={item.id}
                todo={item}
                onChange={(newTodo) => {
                  todoMutation.mutate(newTodo);
                }}
                onDelete={() => todoDelete.mutate(item)}
              />
            )}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
          />
          <AddTodoItem
            onSubmit={(newTodo) => {
              todoMutation.mutate(newTodo);
            }}
          />
        </>
      )}
    </GestureHandlerRootView>
  );
}

export default Todo;
