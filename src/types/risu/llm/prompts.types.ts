
// 프롬프트 아이템
export type PromptItem =
	| PromptItemPlain
	| PromptItemTyped
	| PromptItemChat
	| PromptItemAuthorNote
	| PromptItemChatML
	| PromptItemCache;

// 프롬프트 타입
export type PromptType = PromptItem["type"];

// 프롬프트 설정
export type PromptSettings = {
	assistantPrefill: string;
	postEndInnerFormat: string;
	sendChatAsSystem: boolean;
	sendName: boolean;
	utilOverride: boolean;
	customChainOfThought?: boolean;
	maxThoughtTagDepth?: number;
};

// 순수 프롬프트 아이템 인터페이스
export interface PromptItemPlain {
	type: "plain" | "jailbreak" | "cot";
	type2: "normal" | "globalNote" | "main";
	text: string;
	role: "user" | "bot" | "system";
	name?: string;
}

// 프롬프트 아이템 채팅 ML
export interface PromptItemChatML {
	type: "chatML";
	text: string;
	name?: string;
}

// 프롬프트 아이템 타입
// 타입 - 케릭터 페르소나, 케릭터 설명, 케릭터 로어북, ETC, 케릭터 메모리
export interface PromptItemTyped {
	type: "persona" | "description" | "lorebook" | "postEverything" | "memory";
	innerFormat?: string;
	name?: string;
}

// 프롬프트 아이템 작가 노트
export interface PromptItemAuthorNote {
	type: "authornote";
	innerFormat?: string;
	defaultText?: string;
	name?: string;
}

// 프롬프트 아이템 채팅
export interface PromptItemChat {
	type: "chat";
	rangeStart: number;
	rangeEnd: number | "end";
	chatAsOriginalOnSystem?: boolean;
	name?: string;
}

// 프롬프트 아이템 캐시
export interface PromptItemCache {
	type: "cache";
	name: string;
	depth: number;
	role: "user" | "assistant" | "system" | "all";
}
