import EditorClient from './editor-client';

export async function generateStaticParams() {
  return [];
}

export default function EditorPage() {
  return <EditorClient />;
}
