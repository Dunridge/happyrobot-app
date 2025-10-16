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
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-gray-900">Projects</h1>

      <div className="p-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
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
            <Form className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">
                  Project Name
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter project name"
                  className="w-full p-3 rounded-lg border border-gray-700 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                  className="w-full p-3 rounded-lg border border-gray-700 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                className="h-[32px] cursor-pointer font-sans text-sm leading-6 self-start bg-[#0c0c0c] text-white px-6 rounded-md font-medium transition-colors duration-200 hover:bg-[#1a1a1a] active:scale-[0.98]"
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

  // TODO: style like https://www.happyrobot.ai/blog
  // return (
  //   <div className="p-4 max-w-4xl mx-auto flex flex-col gap-6">
  //     <h1 className="text-3xl font-bold">Projects</h1>

  //     <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col gap-4">
  //       <h2 className="text-white text-xl font-semibold">Add New Project</h2>

  //       <Formik
  //         initialValues={{ name: "", description: "" }}
  //         validationSchema={validationSchema}
  //         onSubmit={(values, { resetForm }) => {
  //           handleAddProject(values).then(() => resetForm());
  //         }}
  //       >
  //         {({ isSubmitting }) => (
  //           <Form className="flex flex-col gap-4">
  //             <div className="flex flex-col gap-2">
  //               <label className="font-medium text-gray-700 dark:text-gray-200">
  //                 Project Name
  //               </label>
  //               <Field
  //                 type="text"
  //                 name="name"
  //                 placeholder="Enter project name"
  //                 className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
  //               />
  //               <ErrorMessage
  //                 name="name"
  //                 component="div"
  //                 className="text-red-500 text-sm"
  //               />
  //             </div>

  //             <div className="flex flex-col gap-2">
  //               <label className="font-medium text-gray-700 dark:text-gray-200">
  //                 Description
  //               </label>
  //               <Field
  //                 as="textarea"
  //                 name="description"
  //                 placeholder="Enter project description (optional)"
  //                 className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
  //               />
  //               <ErrorMessage
  //                 name="description"
  //                 component="div"
  //                 className="text-red-500 text-sm"
  //               />
  //             </div>

  //             <button
  //               type="submit"
  //               disabled={isSubmitting}
  //               className="self-start bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-medium shadow"
  //             >
  //               Add Project
  //             </button>
  //           </Form>
  //         )}
  //       </Formik>
  //     </div>

  //     <ProjectList projects={projects} />
  //   </div>
  // );
}
