import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { verifyAdminToken, AUTH_COOKIE_NAME } from "@/lib/admin-auth";

function authenticate(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function POST(req: NextRequest) {
  if (!authenticate(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Validate type
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed. Use JPG, PNG, or WebP." }, { status: 400 });
  }

  // Validate size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(filePath, buffer);

  return NextResponse.json({ url: `/images/uploads/${filename}`, filename });
}
