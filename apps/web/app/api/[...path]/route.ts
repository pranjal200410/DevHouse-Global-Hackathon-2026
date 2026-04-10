import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const API_PROXY_TARGET = process.env.API_PROXY_TARGET ?? "http://localhost:4000";

const createTargetUrl = (request: NextRequest, pathSegments: string[] | undefined): string => {
  const normalizedPath = (pathSegments ?? []).join("/");
  const search = request.nextUrl.search || "";
  return `${API_PROXY_TARGET}/${normalizedPath}${search}`;
};

const copyHeaders = (request: NextRequest): Headers => {
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  return headers;
};

const proxyRequest = async (
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
): Promise<Response> => {
  const params = await context.params;
  const targetUrl = createTargetUrl(request, params.path);
  const headers = copyHeaders(request);

  try {
    const method = request.method.toUpperCase();
    const hasBody = method !== "GET" && method !== "HEAD";
    const body = hasBody ? await request.text() : undefined;

    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: upstream.headers,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: {
          code: "UPSTREAM_UNREACHABLE",
          message: "Unable to reach API service.",
        },
      },
      { status: 502 },
    );
  }
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
export const HEAD = proxyRequest;
