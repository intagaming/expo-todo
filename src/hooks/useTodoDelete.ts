import _ from "lodash";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import supabase from "../lib/supabase";
import { definitions } from "../types/supabase";
import { todosKey, TodosPage } from "./useTodosQuery";

const deleteTodo = async (todo: Partial<definitions["todos"]>) => {
  const { error } = await supabase
    .from<definitions["todos"]>("todos")
    .delete()
    .match({ id: todo.id });
  if (error) {
    throw Error(error.message);
  }
};

const useTodoDelete = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Partial<definitions["todos"]>, { prev: any }>(
    (todo) => deleteTodo(todo),
    {
      onMutate: async (todo) => {
        await queryClient.cancelQueries(todosKey.all);

        const prev = queryClient.getQueryData(todosKey.all);

        queryClient.setQueryData<InfiniteData<TodosPage> | undefined>(
          todosKey.all,
          (old) => {
            if (!old) return old;

            const newData = _.cloneDeep(old);
            newData.pages.some((page) => {
              const found = page.todos.findIndex(
                (findTodo) => findTodo.id === todo.id
              );
              if (found === -1) return false;
              page.todos.splice(found, 1);
              return true;
            });

            return newData;
          }
        );

        return { prev };
      },
      onError: (_err, _todo, ctx) => {
        queryClient.setQueryData(todosKey.all, ctx?.prev);
      },
      onSettled: () => {
        queryClient.invalidateQueries(todosKey.all);
      },
    }
  );
};

export default useTodoDelete;
