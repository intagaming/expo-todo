import { FlatList, StyleSheet, Text, View } from "react-native";
import AddTodoItem from "../components/AddTodoItem";
import TodoItem from "../components/TodoItem";
import useTodoMutation from "../hooks/useTodoMutation";
import useTodosQuery from "../hooks/useTodosQuery";

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});

function Todo() {
  const { data, error, isLoading, hasNextPage, fetchNextPage } =
    useTodosQuery();

  const todos = data && data.pages.flatMap((page) => page.todos);

  const todoMutation = useTodoMutation();

  return (
    <View style={styles.container}>
      {isLoading && <Text>Please wait...</Text>}
      {error && <Text>{error.message}</Text>}
      {todos && todos.length === 0 && <Text>List is empty.</Text>}
      {todos && (
        <>
          <FlatList
            data={todos}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onChange={(newTodo) => {
                  todoMutation.mutate(newTodo);
                }}
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
    </View>
  );
}

export default Todo;
