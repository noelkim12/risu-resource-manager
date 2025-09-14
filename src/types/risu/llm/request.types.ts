import type { LLMModel } from "./model.types";
import type { MCPTool, RPCToolCallContent } from "./mcp.types";
import type { Character } from "../character/character.types";
import type { OpenAIChat } from "./openai.types";
import type { ModelModeExtended } from "./llm.param.types";

export type ToolCall = {
	name: string;
	arguments: string;
};
export type ToolCallResponse = {
	caller: ToolCall;
	result: RPCToolCallContent[];
};

interface RequestDataArgument {
	formated: OpenAIChat[];
	bias: { [key: number]: number };
	biasString?: [string, number][];
	currentChar?: Character;
	temperature?: number;
	maxTokens?: number;
	PresensePenalty?: number;
	frequencyPenalty?: number;
	useStreaming?: boolean;
	isGroupChat?: boolean;
	useEmotion?: boolean;
	continue?: boolean;
	chatId?: string;
	noMultiGen?: boolean;
	schema?: string;
	extractJson?: string;
	imageResponse?: boolean;
	previewBody?: boolean;
	staticModel?: string;
	escape?: boolean;
	tools?: MCPTool[];
	rememberToolUsage?: boolean;
}

export interface RequestDataArgumentExtended extends RequestDataArgument {
	aiModel?: string;
	multiGen?: boolean;
	abortSignal?: AbortSignal;
	modelInfo?: LLMModel;
	customURL?: string;
	mode?: ModelModeExtended;
	key?: string;
	additionalOutput?: string;
}

export type requestDataResponse =
	| {
			type: "success" | "fail";
			result: string;
			noRetry?: boolean;
			special?: {
				emotion?: string;
			};
			failByServerError?: boolean;
			model?: string;
	  }
	| {
			type: "streaming";
			result: ReadableStream<StreamResponseChunk>;
			special?: {
				emotion?: string;
			};
			model?: string;
	  }
	| {
			type: "multiline";
			result: ["user" | "char", string][];
			special?: {
				emotion?: string;
			};
			model?: string;
	  };

export interface StreamResponseChunk {
	[key: string]: string;
}
