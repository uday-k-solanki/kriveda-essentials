import { NextRequest, NextResponse } from "next/server";
import { readCMSStore, writeCMSStore } from "@/lib/cms-server";
import { verifyAdminToken, AUTH_COOKIE_NAME } from "@/lib/admin-auth";

function authenticate(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function GET(req: NextRequest) {
  if (!authenticate(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const store = readCMSStore();
  return NextResponse.json(store);
}

export async function PUT(req: NextRequest) {
  if (!authenticate(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const current = readCMSStore();
  const updated = { ...current, ...body, version: current.version + 1 };
  writeCMSStore(updated);
  return NextResponse.json({ success: true, updatedAt: updated.updatedAt });
}
