export interface OpenAIChat {
	role: "system" | "user" | "assistant" | "function";
	content: string;
	memo?: string;
	name?: string;
	removable?: boolean;
	attr?: string[];
	multimodals?: MultiModal[];
	thoughts?: string[];
	cachePoint?: boolean;
}

export interface MultiModal {
	type: "image" | "video" | "audio";
	base64: string;
	height?: number;
	width?: number;
}

export interface OpenAIChatFull extends OpenAIChat {
	function_call?: {
		name: string;
		arguments: string;
	};
	tool_calls?: {
		function: {
			name: string;
			arguments: string;
		};
		id: string;
		type: "function";
	}[];
}

export interface RequestTokenPart {
	name: string;
	tokens: number;
}
