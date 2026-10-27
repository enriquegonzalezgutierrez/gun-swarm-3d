export function requireElement(documentRef: Document, id: string): HTMLElement {
  const element = documentRef.getElementById(id);
  if (element === null) {
    throw new Error(`Missing UI element: #${id}`);
  }
  return element;
}
