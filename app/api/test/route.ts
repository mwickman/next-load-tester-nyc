import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const url = body.url;
  if (!url || url == "") {
    return NextResponse.json({ message: "url is required" }, { status: 400 });
  }
  const requestCount = body.count
  if (!requestCount || requestCount <= 0) {
    return NextResponse.json({ message: "count must be a positive number" }, { status: 400 });
  }

  console.log(`sending ${requestCount} requests to ${url}`);
  const requests = []
  for(let i = 0; i < requestCount; i++) {
    requests.push(fetch(url, {cache: "no-store"}))
  }
  Promise.all(requests).then((responses) => {
    console.log(`got ${responses.length} responses`);
  }).catch((error) => {
    console.error("error from Promise.all:")
    console.error(error);
  })
  
  return NextResponse.json({ message: "started requests" });
}
