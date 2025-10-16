"use client";
import { useEffect, useState } from "react";
import ProjectList from "@/components/ProjectList";
import { Project } from "@/types/types";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Project name is required"),
  description: Yup.string(),
});

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  const handleAddProject = async (values: {
    name: string;
    description?: string;
  }) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to create project");
        return;
      }

      const savedProject: Project = await res.json();
      setProjects((prev) => [...prev, savedProject]);
      toast.success("Project created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Network error: failed to create project");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Projects</h1>

      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Add New Project</h2>

        <Formik
          initialValues={{ name: "", description: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleAddProject(values).then(() => resetForm());
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 dark:text-gray-200">
                  Project Name
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter project name"
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 dark:text-gray-200">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter project description (optional)"
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="self-start bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-medium shadow"
              >
                Add Project
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}
