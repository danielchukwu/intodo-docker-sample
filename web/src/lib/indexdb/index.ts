import { request } from "@/lib/indexdb/initialize";
import { type Todo } from "@/app/(home)/page";
import * as constants from "../const";

// request.onsuccess = () => {
//   const db = request.result;
//   const tx = db.transaction("todo-app", "readwrite");

//   const store = tx.objectStore("todo");

//   // insert
//   store.put({id: 1, title: "Need to wash", completed: false});
//   store.put({id: 2, title: "I need to buy groceries for the week, and also pick up some medicine from the pharmacy. I'll need to do this before 11am tomorrow.", completed: false});
//   store.put({id: 3, title: "Me and my friends are going to the movies tonight, and we need to pick up the tickets and snacks before 6pm today.", completed: false});
//   store.put({id: 4, title: "I would like to go to the gym tomorrow morning, but I'm not sure if I'll be able to make it.", completed: false});
//   store.put({id: 5, title: "Finish the project for the class tomorrow.", completed: false});

//   // read
//   const todoQuery = store.getAll();

//   todoQuery.onsuccess = () => {
//     const todos = todoQuery.result;
//     console.log(todos);
//   }
// }

export const createTodo = async (todo: Todo) => {
  const request = indexedDB.open(constants.localDBName, constants.version);

  request.onerror = (event) => {
    console.log("An error occured with IndexDB");
    console.log(event);
  }

  request.onsuccess = () => {
    const db = request.result;
    const tx = db.transaction("todo", "readwrite");
    const store = tx.objectStore("todo");
    store.put({...todo, completed: todo.completed === false ? 0 : 1});

    tx.oncomplete = () => {
      db.close();
    }
  }
}


export const updateTodo = async (todo: Todo) => {
  // this is possible because the .put(...) method creates or updates 
  // an existing record if a record with that id was not found
  createTodo(todo);
}

export const deleteTodo = async (id: string) => {
  console.log("DELETING...", id)
  const request = indexedDB.open(constants.localDBName, constants.version);

  request.onerror = (event) => {
    console.log("An error occured with indexDB");
    console.log(event);
  }

  request.onsuccess = () => {
    console.log("DELETING... 1")
    const db = request.result;
    const tx = db.transaction('todo', 'readwrite');

    console.log("DELETING... 2")
    const store = tx.objectStore('todo');
    store.delete([id]);

    console.log("DELETING... 3")
    tx.oncomplete = () => {
      db.close();
    }
  }
}


export const getTodos = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("todo-app", 1);
    
    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("todo", "readonly");
      const store = tx.objectStore("todo");
      const storeQuery = store.getAll();

      storeQuery.onsuccess = () => {
        const result = storeQuery.result;
        resolve(result);
      };

      storeQuery.onerror = () => {
        reject(storeQuery.error);
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  });
}
