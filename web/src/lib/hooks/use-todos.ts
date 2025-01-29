import { todoApi } from "@/app/api/todos";
import { todosTableType } from "@/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'],
  list: (filter: string) => [...todoKeys.all, { filter }],
}

export function useTodos() {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: todoApi.getTodos,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todo: todosTableType) => todoApi.createTodo(todo),
    onSuccess: () =>{
      queryClient.invalidateQueries({queryKey: todoKeys.lists()})
    }
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({id, todo} : { id: string, todo: todosTableType }) => todoApi.updateTodo(id, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    }
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    }
  })
}