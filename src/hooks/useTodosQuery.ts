import { useInfiniteQuery, UseInfiniteQueryResult } from "react-query";
import supabase from "../lib/supabase";
import { definitions } from "../types/supabase";

export const todosKey = {
  all: ["todos"],
};

const TODOS_PER_PAGE = 10;

type TodosPage = {
  page: number;
  todos: definitions["todos"][];
};

const getTodos = async ({ pageParam = 0 }): Promise<TodosPage> => {
  const { data, error } = await supabase
    .from<definitions["todos"]>("todos")
    .select()
    .order("id", { ascending: false })
    .range(
      pageParam * TODOS_PER_PAGE,
      pageParam * TODOS_PER_PAGE + TODOS_PER_PAGE - 1
    );

  if (error) {
    throw new Error(error.message);
  }

  return {
    page: pageParam,
    // @ts-ignore
    todos: data,
  };
};

const useTodosQuery = (): UseInfiniteQueryResult<TodosPage, Error> =>
  useInfiniteQuery(todosKey.all, getTodos, {
    getNextPageParam: (lastPage) =>
      lastPage.todos.length === 0 ? undefined : lastPage.page + 1,
  });

export default useTodosQuery;
