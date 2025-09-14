import type { OpenAIChat } from "../llm/openai.types";

export interface Message {
	role: "user" | "char";
	data: string;
	saying?: string;
	chatId?: string;
	time?: number;
	generationInfo?: MessageGenerationInfo;
	promptInfo?: MessagePresetInfo;
	name?: string;
	otherUser?: boolean;
}

export interface MessageGenerationInfo {
	model?: string;
	generationId?: string;
	inputTokens?: number;
	outputTokens?: number;
	maxContext?: number;
	stageTiming?: {
		stage1?: number;
		stage2?: number;
		stage3?: number;
		stage4?: number;
	};
}

export interface MessagePresetInfo {
	promptName?: string;
	promptToggles?: { key: string; value: string }[];
	promptText?: OpenAIChat[];
}