import { request } from '@/lib/request';
import { failure, success } from '@/lib/result';
import type { Result } from '@/types/result';

import {
  type CrudCrudTodo,
  type Todo,
  mapFromCrudCrud,
  mapToCrudCrud,
} from '@/app/(private)/todo/_types/todo';

// CrudCrudのベースURL
function getCrudCrudBaseUrl(): string {
  const endpointId = process.env.CRUDCRUD_ENDPOINT_ID;

  if (!endpointId || endpointId === 'your-unique-endpoint-id-here') {
    throw new Error(
      'CRUDCRUD_ENDPOINT_IDが設定されていません。.env.localに正しいエンドポイドIDを設定してください。'
    );
  }

  return `https://crudcrud.com/api/${endpointId}/todos`;
}

/**
 * TODO一覧を取得
 * CrudCrudからGETリクエストで全TODOを取得し、Data Cacheでキャッシュ
 */
export async function fetchTodos(): Promise<Result<Todo[]>> {
  try {
    const url = getCrudCrudBaseUrl();

    // デバッグ用：実際のURLをログ出力
    console.log('[fetchTodos] リクエストURL:', url);

    const response = await request<CrudCrudTodo[]>(url, {
      next: {
        tags: ['todos'],
        // revalidate: 3600, // 1時間キャッシュ
      },
    });

    if (!response.isSuccess) {
      console.error('[fetchTodos] エラー:', response.errorMessage);
      return failure(response.errorMessage);
    }

    // CrudCrudの_idをidに変換
    const todos = response.data.map(mapFromCrudCrud);
    console.log('[fetchTodos] 取得成功:', todos.length, '件');

    return success(todos);
  } catch (error) {
    console.error('[fetchTodos] 例外:', error);
    return failure(
      error instanceof Error ? error.message : 'TODOの取得中に予期しないエラーが発生しました'
    );
  }
}

/**
 * TODOを作成
 * CrudCrudへPOSTリクエストでTODOを作成
 */
export async function createTodoApi(payload: { title: string }): Promise<Result<Todo>> {
  try {
    const trimmedTitle = payload.title.trim();

    if (!trimmedTitle) {
      return failure('タイトルは必須です');
    }

    const url = getCrudCrudBaseUrl();

    const response = await request<CrudCrudTodo>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: trimmedTitle, isDone: false }),
      cache: 'no-store', // 作成処理はキャッシュしない
    });

    if (!response.isSuccess) {
      return failure(response.errorMessage);
    }

    // CrudCrudの_idをidに変換
    const todo = mapFromCrudCrud(response.data);

    return success(todo);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : 'TODOの作成中に予期しないエラーが発生しました'
    );
  }
}

/**
 * TODOの完了状態を切り替え
 * CrudCrudへPUTリクエストでTODOを更新
 */
export async function toggleTodoApi(payload: {
  id: string;
  isDone: boolean;
  title: string;
}): Promise<Result<Todo>> {
  try {
    const url = `${getCrudCrudBaseUrl()}/${payload.id}`;

    // CrudCrud用のペイロードに変換（_idは除外）
    const crudcrudPayload = mapToCrudCrud({ title: payload.title, isDone: payload.isDone });

    console.log('[toggleTodoApi] リクエストURL:', url);
    console.log('[toggleTodoApi] ペイロード:', crudcrudPayload);

    const response = await request<CrudCrudTodo>(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(crudcrudPayload),
      cache: 'no-store', // 更新処理はキャッシュしない
    });

    console.log('[toggleTodoApi] レスポンス:', response);

    if (!response.isSuccess) {
      console.error('[toggleTodoApi] エラー:', response.errorMessage);
      return failure(response.errorMessage);
    }

    // CrudCrudのPUTは空のレスポンスを返す場合があるため、
    // レスポンスが空の場合は、送信したデータから楽観的に構築
    let todo: Todo;
    if (response.data && Object.keys(response.data).length > 0) {
      // レスポンスにデータがある場合は、それを使用
      todo = mapFromCrudCrud(response.data);
    } else {
      // レスポンスが空の場合は、送信したデータから構築
      todo = {
        id: payload.id,
        title: payload.title,
        isDone: payload.isDone,
      };
    }

    console.log('[toggleTodoApi] 更新成功:', todo);

    return success(todo);
  } catch (error) {
    console.error('[toggleTodoApi] 例外:', error);
    return failure(
      error instanceof Error ? error.message : 'TODOの更新中に予期しないエラーが発生しました'
    );
  }
}
