"use client";
import { useEffect, useState } from "react";
import ProjectList from "@/components/ProjectList";
import { Project } from "@/types/types";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loader from "@/components/Loader";

const validationSchema = Yup.object({
  name: Yup.string().required("Project name is required"),
  description: Yup.string(),
});

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
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

  const handleDeleteProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to delete project");
        return;
      }

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success("Project deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Network error: failed to delete project");
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 mt-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Projects</h1>

      {loading ? (
        <Loader />
      ) : (
        <ProjectList
          projects={projects}
          handleDeleteProject={handleDeleteProject}
        />
      )}

      <div className="flex flex-col gap-14 p-8 rounded-2xl bg-white border border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Add New Project
        </h2>

        <Formik
          initialValues={{ name: "", description: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleAddProject(values).then(() => resetForm());
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">
                  Project Name
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter project name"
                  className="w-full h-9 p-3 rounded-lg border border-gray-700 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter project description (optional)"
                  className="w-full h-24 p-3 rounded-lg border border-gray-700 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  rows={3}
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
                className="w-full h-[32px] cursor-pointer font-sans text-sm leading-6 self-start bg-[#0c0c0c] text-white px-6 rounded-md font-medium transition-colors duration-200 hover:bg-[#1a1a1a] active:scale-[0.98]"
              >
                Add Project
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
