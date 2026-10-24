export interface Task {
  id: number;
  title: string;
  remindAt: string | null;
  reminded: boolean;
  done: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TasksPage {
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type Filter = "all" | "pending" | "done";
