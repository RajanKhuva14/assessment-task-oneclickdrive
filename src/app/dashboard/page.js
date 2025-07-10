import Dashboard from "./Dashboard";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default async function DashboardPage({ searchParams }) {
  const page = Number(searchParams?.page ?? 1);
  const pageSize = Number(searchParams?.pageSize ?? 10);

  try {
    const res = await fetch(
      `${baseUrl}/api/listings?page=${page}&pageSize=${pageSize}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      console.error("API error:", res.status, res.statusText);
      return <div>Failed to load dashboard data.</div>;
    }
    const json = await res.json();

    return (
      <Dashboard
        initialRows={json.data || []}
        rowCount={json.totalCount}
        currentPage={page}
        currentPageSize={pageSize}
      />
    );
  } catch (err) {
    console.error("Fetch error:", err);
    return <div>Error loading dashboard data.</div>;
  }
}
