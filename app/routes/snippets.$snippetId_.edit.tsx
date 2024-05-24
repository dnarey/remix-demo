import {
  ActionFunctionArgs,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import SnippetEditForm from "~/components/snippet-edit-form";
import { db } from "~/db";

export default function SnippetEditPage() {
  const snippet = useLoaderData<typeof loader>();

  if (!snippet) return null;

  return (
    <>
      <div>
        <SnippetEditForm snippet={snippet} />
      </div>
      <div className="my-4 text-cyan-400">
        <Link to="/">Back to snippets</Link>
      </div>
    </>
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
  const snippetData = Object.fromEntries(formData);

  await db.snippet.update({
    where: { id: parseInt(snippetData.id as string) },
    data: { code: snippetData.code as string },
  });

  return redirect(`/snippets/${snippetData.id}`);
}
