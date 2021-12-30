import { useMutation, UseMutationResult, useQueryClient } from "react-query";
import supabase from "../lib/supabase";
import { definitions } from "../types/supabase";
import { todosKey } from "./useTodosQuery";

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

const useTodoMutation = (): UseMutationResult<
  unknown,
  Error,
  Partial<definitions["todos"]>
> => {
  const queryClient = useQueryClient();

  return useMutation(
    (newTodo: Partial<definitions["todos"]>) => {
      if (newTodo.id === undefined) {
        return insertTodo(newTodo);
      }
      return updateTodo(newTodo);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(todosKey.all);
      },
    }
  );
};

export default useTodoMutation;
