// アプリケーション内部で使用する型
export type Todo = {
  id: string;
  title: string;
  isDone: boolean;
};

// CrudCrudのレスポンス型（_idを使用）
export type CrudCrudTodo = {
  _id: string;
  title: string;
  isDone: boolean;
};

// CrudCrud → Todo への変換
export function mapFromCrudCrud(crudcrudTodo: CrudCrudTodo): Todo {
  return {
    id: crudcrudTodo._id,
    title: crudcrudTodo.title,
    isDone: crudcrudTodo.isDone,
  };
}

// Todo → CrudCrud への変換（idは除外）
export function mapToCrudCrud(todo: Partial<Todo>): Omit<Partial<CrudCrudTodo>, '_id'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = todo;
  return rest;
}
