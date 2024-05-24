import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { db } from "~/db";

export default function NewSnippet() {
  const data = useActionData<typeof action>();

  return (
    <Form method="post">
      <h3 className="font-bold m-3">Create a Snippet</h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <label className="w-12" htmlFor="title">
            Title
          </label>
          <input
            name="title"
            className="border rounded p-2 w-full"
            id="title"
          />
        </div>

        <div className="flex gap-4">
          <label className="w-12" htmlFor="code">
            Code
          </label>
          <textarea
            name="code"
            className="border rounded p-2 w-full"
            id="code"
          />
        </div>

        {data?.message ? (
          <div className="my-2 p-2 bg-red-200 border rounded border-red-400">
            {data.message}
          </div>
        ) : null}

        <button type="submit" className="rounded p-2 bg-blue-200">
          Create
        </button>
      </div>
    </Form>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const snippetData = Object.fromEntries(formData);

  if (
    typeof snippetData.title !== "string" ||
    snippetData.title.trim().length < 3
  ) {
    return { message: "Title must be longer" };
  }

  if (typeof snippetData.code !== "string" || snippetData.code.length < 10) {
    return { message: "Code must be longer" };
  }

  await db.snippet.create({
    data: {
      title: snippetData.title,
      code: snippetData.code,
    },
  });

  return redirect("/");
}
