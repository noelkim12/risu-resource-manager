export type MCPPrompt = {
	name: string; // Unique identifier for the prompt
	description?: string; // Human-readable description
	arguments?: {
		// Optional list of arguments
		name: string; // Argument identifier
		description?: string; // Argument description
		required?: boolean; // Whether argument is required
	}[];
	url?: string;
};

export type MCPTool = {
	name: string;
	description: string;
	inputSchema: any; // JSON schema for input validation
	annotations?: any; // Annotations for the tool, can be used for documentation or metadata
};

export type JsonRPC = {
	jsonrpc: "2.0";
	id: number | string;
	result?: any;
	error?: {
		code: number;
		message: string;
		data?: any;
	};
};

export type JsonPing = {
	jsonrpc: "2.0";
	id: string;
	method: "ping";
};

export type RPCRequestResult = {
	rpc: JsonRPC;
	http: {
		status: number;
		headers: Record<string, string>;
	};
};

export type SseEventDetail = {
	mcpClientObjectId: string;
	data: JsonRPC;
};

export type RPCToolCallTextContent = {
	type: "text";
	text: string;
};

export type RPCToolCallImageAudioContent = {
	type: "image" | "audio";
	data: string; // Base64 encoded image
	mimeType: string; // e.g. 'image/png', 'image/jpeg'
};

export type RPCToolCallContentResource = {
	type: "resource";
	resource: {
		uri: string;
		mimeType: string;
		text: string;
	};
};

export type RPCToolCallContent =
	| RPCToolCallTextContent
	| RPCToolCallImageAudioContent
	| RPCToolCallContentResource;
