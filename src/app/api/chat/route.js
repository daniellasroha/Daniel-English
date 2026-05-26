export async function POST() {
  return Response.json({ error: "Fitur ini tidak aktif." }, { status: 404 });
}
