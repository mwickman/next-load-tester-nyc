import { NextRequest, NextResponse } from "next/server";
const { exec } = require("child_process");

export async function OPTIONS(req: Request) {
  // Handle preflight requests
  const res = NextResponse.json({ message: "ok" });
  res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.headers.set("Access-Control-Allow-Headers", "*");
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const url = body.url;
  if (!url || url == "") {
    return NextResponse.json({ message: "url is required" }, { status: 400 });
  }
  const requestCount = body.count;
  if (!requestCount || requestCount <= 0) {
    return NextResponse.json({ message: "count must be a positive number" }, { status: 400 });
  }
  const proxyURLAndPort = body.proxyURLAndPort;
  if (!proxyURLAndPort || proxyURLAndPort == "") {
    return NextResponse.json({ message: "proxyURLAndPort is required" }, { status: 400 });
  }
  const proxyUser = body.proxyUser;
  if (!proxyUser || proxyUser == "") {
    return NextResponse.json({ message: "proxyUser is required" }, { status: 400 });
  }
  const concurrency = body.concurrency;
  if (!concurrency || concurrency <= 0) {
    return NextResponse.json({ message: "concurrency must be a positive number" }, { status: 400 });
  }

  // shell out to apachebench and start a load test
  exec(`ab -n ${requestCount} -c ${concurrency} -X ${proxyURLAndPort} -P ${proxyUser} ${url}`, (err: any, stdout: any, stderr: any) => {
    if (err) {
      console.error("Apache bench run failure");
      console.error(err);
    }
    console.log(stdout);
  });
  const finalRes = NextResponse.json({ message: "started requests" });
  // res.headers.set('Access-Control-Allow-Origin', '*');
  finalRes.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  finalRes.headers.set("Access-Control-Allow-Headers", "*");
  finalRes.headers.set("Access-Control-Allow-Origin", "*");
  return finalRes;
}
