const indexedDB = window.indexedDB;

export const request = indexedDB.open("todo-app", 1);

request.onerror = (event: Event) => {
  console.log("An error occurred with IndexedDB");
  console.log(event);
};

request.onupgradeneeded = () => {
  const db = request.result;
  const store = db.createObjectStore("todo", {keyPath: "id"});
  store.createIndex("todo_title", ["todo"], {unique: false});
  store.createIndex("todo_completed", ["completed"], {unique: false});

  console.log("OnUpgradeNeeded Ran!!!")
}
