export type Task = {
  id: string;
  projectId: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  dependencies: string[];
};

export type Project = {
  id: string;
  name: string;
  description?: string;
};
