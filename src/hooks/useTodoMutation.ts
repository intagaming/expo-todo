import _ from "lodash";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import supabase from "../lib/supabase";
import { definitions } from "../types/supabase";
import { todosKey, TodosPage } from "./useTodosQuery";

const insertTodo = async (newTodo: Partial<definitions["todos"]>) => {
  const { error } = await supabase.from<definitions["todos"]>("todos").insert({
    ...newTodo,
    user_id: supabase.auth.user()?.id,
  });
  if (error) {
    throw Error(error.message);
  }
};

const updateTodo = async (newTodo: Partial<definitions["todos"]>) => {
  const { error } = await supabase
    .from<definitions["todos"]>("todos")
    .update(newTodo)
    .match({ id: newTodo.id });
  if (error) {
    throw Error(error.message);
  }
};

const useTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    Partial<definitions["todos"]>,
    { prev: any }
  >(
    (newTodo) => {
      if (newTodo.id === undefined) {
        return insertTodo(newTodo);
      }
      return updateTodo(newTodo);
    },
    {
      onMutate: async (newTodo) => {
        await queryClient.cancelQueries(todosKey.all);

        const prev = queryClient.getQueryData(todosKey.all);

        queryClient.setQueryData<InfiniteData<TodosPage> | undefined>(
          todosKey.all,
          (old) => {
            if (!old) return old;

            const newData = _.cloneDeep(old);
            if (newTodo.id === undefined) {
              newData.pages[0].todos.unshift({
                id: _.random(-Number.MIN_SAFE_INTEGER, -1),
                user_id: supabase.auth.user()?.id as string,
                inserted_at: new Date().toLocaleString(),
                ...newTodo,
              });
            } else {
              newData.pages.some((page) => {
                const found = page.todos.findIndex(
                  (findTodo) => findTodo.id === newTodo.id
                );
                if (found === -1) return false;
                const oldTodo = page.todos[found];
                page.todos.splice(found, 1, { ...oldTodo, ...newTodo });
                return true;
              });
            }

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

export default useTodoMutation;
