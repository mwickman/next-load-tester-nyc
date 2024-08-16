import { NextRequest, NextResponse } from "next/server";
const { exec } = require("child_process");

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
  const proxyURLAndPort = body.proxyURLAndPort
  if (!proxyURLAndPort || proxyURLAndPort == "") {
    return NextResponse.json({ message: "proxyURLAndPort is required" }, { status: 400 });
  }
  const proxyUser = body.proxyUser
  if (!proxyUser || proxyUser == "") {
    return NextResponse.json({ message: "proxyUser is required" }, { status: 400 });
  }
  const concurrency = body.concurrency
  if (!concurrency || concurrency <= 0) {
    return NextResponse.json({ message: "concurrency must be a positive number" }, { status: 400 });
  }

  // shell out to apachebench and start a load test
  exec(
    `ab -n ${requestCount} -c ${concurrency} -X ${proxyURLAndPort} -P ${proxyUser} ${url}`,
    (err: any, stdout: any, stderr: any) => {
      if (err) {
        console.error("Apache bench run failure")
        console.error(err);
      }
      console.log(stdout);
    }
  );
  return NextResponse.json({ message: "started requests" });
}
