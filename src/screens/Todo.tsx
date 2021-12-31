import { FlatList, StyleSheet, Text, View } from "react-native";
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

  const todos = data && data.pages.flatMap((page) => page.todos);

  const todoMutation = useTodoMutation();
  const todoDelete = useTodoDelete();

  return (
    <View style={styles.container}>
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
    </View>
  );
}

export default Todo;
