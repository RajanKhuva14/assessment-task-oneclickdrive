import { NextResponse } from "next/server";
import {
  approveListing,
  rejectListing,
  updateListing,
  listings as mockData,
} from "./mockData";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = mockData.slice(start, end);

  return NextResponse.json({
    data: paginated,
    totalCount: mockData.length,
  });
}

export async function POST(req) {
  const { id, action, data } = await req.json();
  let result = null;
  if (action === "approve") {
    result = approveListing(id);
  } else if (action === "reject") {
    result = rejectListing(id);
  } else if (action === "edit") {
    result = updateListing(id, data);
  }
  if (result) {
    return Response.json({ success: true, data: result });
  }
  return Response.json({ success: false }, { status: 400 });
}
