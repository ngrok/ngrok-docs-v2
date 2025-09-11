import { ConfigExample } from "/snippets/components/ConfigExample";

export const CustomResponse = () => (
	<ConfigExample
		config={{
			on_http_request: [
				{
					expressions: ["!('authorization' in req.headers)"],
					actions: [
						{
							type: "custom-response",
							config: {
								status_code: 401,
								body: "Unauthorized",
							},
						},
					],
				},
			],
		}}
	/>
);
