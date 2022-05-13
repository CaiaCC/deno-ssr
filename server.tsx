// deno run -A --no-check server.tsx
// header: text/html text/json
// 1. GET /html -> <h1>Hello Friends</h1> // without using react-dom server
// 1. GET /html?q=moo -> <h1>moo</h1> // without using react-dom server
// 1. GET /ssr -> <Body/> -> default static value msg value, take static component and send it back to
// 1. GET /ssr?message=meow -> <Body message='meow" /> ->

// SSG = BUILD time 'next build" -> run ONE time at build
// SSR = run time -> run for every request
``
import React from "https://esm.sh/react";
// web streams API
import { renderToReadableStream } from "https://esm.sh/react-dom/server";
import { serve } from "https://deno.land/std/http/server.ts"; // wrapper around deno
// AbortController API -> close the stream

const handler = async (request: Request): Promise<Response> => {
	const { url } = request;
	const baseUrl = new URL(url);
	const { pathname } = baseUrl;

	//query path
	const query = new URL(url).searchParams;
	const name = query.get("q");
	const message = query.get("message");

	if (pathname === "/html" && name) {
		const body = `<h1>${name}</h1>`;
		return new Response(body, {
			headers: {
				"content-type": "text/html",
			},
			status: 200,
		});
	} else if (pathname === "/html") {
		const body = "<h1>Hello World~</h1>";
		return new Response(body, {
			headers: {
				"content-type": "text/html",
			},
			status: 200,
		});
	} else if (pathname === "/ssr" && message) {
		const body = await renderToReadableStream(<Body message={message} />);
		return new Response(body, {
			headers: {
				"content-type": "text/html",
			},
			status: 200,
		});
	} else if (pathname === "/ssr") {
		const body = await renderToReadableStream(
			<Body message="Hello Internet!" />
		);
		return new Response(body, {
			headers: {
				"content-type": "text/html",
			},
			status: 200,
		});
	} else return new Response("Hello, World!");
};

interface BodyProps {
	message: string;
}

const Body = ({ message }: BodyProps) => {
	return (
		<>
			<h1>SSR HERE</h1>
			<div>{message}</div>
		</>
	);
};

console.log("Server listening on : http//localhost:8000");
await serve(handler, { port: 8000 });
