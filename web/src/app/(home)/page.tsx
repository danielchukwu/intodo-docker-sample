"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Circle, Trash2, Check, CircleCheck } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { createTodo, getTodos, updateTodo, deleteTodo } from "@/lib/indexdb";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const Page = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<number>(todos.filter((todo) => todo.completed).length);

  const addTodo = async (todo: Todo) => {
    createTodo(todo);
    updateTodosList();
    setCompletedTodos(todos.filter((todo) => todo.completed).length);
  };

  const editTodo = async (todo: Todo) => {
    updateTodo(todo);
    updateTodosList();
    setCompletedTodos(todos.filter((todo) => todo.completed).length);
  }

  const removeTodo = async (id: string) => {
    deleteTodo(id);
    // updateTodosList();
  }

  const updateTodosList = async () => {
    const todos = await getTodos() as Todo[];
    setTodos(todos);
  }

  useEffect(() => {
    updateTodosList();
  },[])

  return (
    <div>
      <main>
        {/* Title, Input, Button */}
        <div className="py-20 bg-gray-50">
          <PageWrapper>
            <TodoForm createTodo={addTodo} />
          </PageWrapper>
        </div>

        {/* List of todos */}
        <div className="py-10">
          <PageWrapper className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <TitleAndCount title="All todos" count={todos.length} />
              <TitleAndCount title="Completed tasks" count={`${completedTodos} out of ${todos.length}`} />
            </div>

            <TodoList todos={todos} updateTodo={editTodo} removeTodo={removeTodo} />
          </PageWrapper>
        </div>
      </main>
    </div>
  );
};
export default Page;

const TodoList = ({ todos, updateTodo, removeTodo }: { todos: Todo[], updateTodo: (todo: Todo) => void, removeTodo: (id: string) => void }) => {
  return (
    <div className="flex flex-col gap-5">
      {todos.map((todo) => (
        <TodoCard key={todo.id} todoo={todo} update={updateTodo} remove={removeTodo} />
      ))}
    </div>
  );
};

const TodoCard = ({ todoo, update, remove }: { todoo: Todo, update: (todo: Todo) => void, remove: (id: string) => void }) => {
  const [todo, setTodo] = useState<Todo>(todoo);

  const onClick = () => {
    const updatedTodo = {...todo, completed: !todo.completed};
    update(updatedTodo);
    setTodo(updatedTodo)
  }
  return (
    <div className="flex gap-4 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100" onMouseDown={onClick}>
      {todo.completed ? <CircleCheck fill="#54a0ff" color="#fff" /> : <Circle className="text-gray-400 size-5 mt-0.5" />}
      <p className="text-black/80 w-full">{todo.title}</p>
      <Trash2 className="text-gray-400 size-5 mt-0.5 hover:text-red-500" onMouseDown={() => remove(todo.id)} />
    </div>
  );
};

const PageWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="flex justify-center w-full">
      <div className={cn("w-full max-w-2xl", className)}>{children}</div>
    </div>
  );
};

const TodoForm = ({ createTodo }: { createTodo: (todo: Todo) => void}) => {
  const [title, setTitle] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const create = () => {
    if (title.trim() === "") return;

    createTodo({ id: `${Math.random() * 1000000}`, title, completed: false });
    inputRef.current!.value = "";
    setTitle("");
  };

  return (
    <div className="flex flex-col justify-center gap-8">
      <h1 className="text-3xl font-black text-center">Todo App</h1>
      <div className="flex space-x-2 items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Write todo here"
          className="outline-none w-full text-sm bg-gray-200/60 rounded-lg h-[3.125rem] px-3 py-3 border-gray-100 border-[0.8px] hover:border-[0.8px] hover:border-gray-300/80 focus:border-[#54a0ff] transition-all box-border"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <Button className="rounded-lg h-[3.125rem] bg-[#54a0ff] hover:bg-[#4b90e4]" onMouseDown={() => create()}>
          Add todo
        </Button>
      </div>
    </div>
  );
};

const TitleAndCount = ({ title, count }: { title: string; count: number | string }) => {
  return (
    <div className="flex items-center gap-3">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex items-center px-2 py-1 rounded-lg bg-gray-200">
        <p className="text-sm text-gray-400 font-medium leading-3">{count}</p>
      </div>
    </div>
  );
};