import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { db } from "~/db";

export default function SnippetDetailsPage() {
  const snippet = useLoaderData<typeof loader>();

  if (!snippet) return null;

  return (
    <div>
      <div className="flex m-4 justify-between items-center">
        <h1 className="text-xl font-bold">{snippet.title}</h1>
        <div className="flex gap-4">
          <Link
            to={`/snippets/${snippet.id}/edit`}
            className="p-2 border rounded"
          >
            Edit
          </Link>
          <Form method="post">
            <input type="hidden" name="id" value={snippet.id} />
            <button className="p-2 border rounded">Delete</button>
          </Form>
        </div>
      </div>
      <pre className="p-3 border rounded bg-gray-200 border-gray-200">
        <code>{snippet.code}</code>
      </pre>
      <div className="my-4 text-cyan-400">
        <Link to="/">Back to snippets</Link>
      </div>
    </div>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.snippetId) {
    const id = parseInt(params.snippetId);
    const snippet = await db.snippet.findFirst({ where: { id } });
    return snippet;
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const snippetId = formData.get("id")?.toString();

  if (snippetId) {
    const id = parseInt(snippetId);
    await db.snippet.delete({
      where: { id },
    });
  }

  return redirect("/");
}
