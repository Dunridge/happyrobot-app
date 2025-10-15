export type Task = {
  id: string;
  projectId: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  dependencies: string[];
  childTasks: RelTask[];
  parentTasks: RelTask[];
};

export type Project = {
  id: string;
  name: string;
  description?: string;
};

export type RelTask = {
  id: string;
  title: string;
};
