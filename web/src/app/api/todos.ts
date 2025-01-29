import { todosTableType } from "@/db/schema";
import { api } from "@/lib/axios"

type Todo = todosTableType;

export const todoApi = {
  getTodos: async () => {
    const { data } = await api.get<Todo[]>('/todos');
    return data;
  },

  createTodo: async (todo: Todo) => {
    const result = await api.post('/todos', todo);
    console.log('Result:', result);
    return {m: 'done'};
  },

  updateTodo: async (id: string, todo: Partial<Todo>) => {
    console.log('DAL: update');
    const result = await api.patch(`/todos/${id}`, todo);
    console.log('Result:', result);
    return {m: 'done'};
  },

  deleteTodo: async (id: string) => {
    console.log('DAL: delete');
    const result = await api.delete(`/todos/${id}`);
    console.log('Result:', result);

    return {m: 'done'};
  }
}
