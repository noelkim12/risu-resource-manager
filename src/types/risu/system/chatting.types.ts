import type { SerializableHypaV2Data } from "../llm/rag/hypaV2.types";
import type { SerializableHypaV3Data } from "../llm/rag/hypaV3.types";
import type { OnnxModelFiles } from "../llm/rag/onnnx.model.types";
import type { CustomScript } from "../preset.types";
import type { LoreBook, LoreSettings } from "../tools/lorebook.types";
import type { Message } from "./message.types";

export interface Chat {
	message: Message[];
	note: string;
	name: string;
	localLore: LoreBook[];
	sdData?: string;
	supaMemoryData?: string;
	hypaV2Data?: SerializableHypaV2Data;
	lastMemory?: string;
	suggestMessages?: string[];
	isStreaming?: boolean;
	scriptstate?: { [key: string]: string | number | boolean };
	modules?: string[];
	id?: string;
	bindedPersona?: string;
	fmIndex?: number;
	hypaV3Data?: SerializableHypaV3Data;
	folderId?: string;
	lastDate?: number;
}

export interface ChatFolder {
	id: string;
	name?: string;
	color?: string;
	folded: boolean;
}

export interface GroupChat {
	type: "group";
	image?: string;
	firstMessage: string;
	chats: Chat[];
	chatFolders: ChatFolder[];
	chatPage: number;
	name: string;
	viewScreen: "single" | "multiple" | "none" | "emp";
	characters: string[];
	characterTalks: number[];
	characterActive: boolean[];
	globalLore: LoreBook[];
	autoMode: boolean;
	useCharacterLore: boolean;
	emotionImages: [string, string][];
	customscript: CustomScript[];
	chaId: string;
	alternateGreetings?: string[];
	creatorNotes?: string;
	removedQuotes?: boolean;
	firstMsgIndex?: number;
	loreSettings?: LoreSettings;
	supaMemory?: boolean;
	ttsMode?: string;
	suggestMessages?: string[];
	orderByOrder?: boolean;
	backgroundHTML?: string;
	reloadKeys?: number;
	backgroundCSS?: string;
	oneAtTime?: boolean;
	virtualscript?: string;
	lorePlus?: boolean;
	trashTime?: number;
	nickname?: string;
	defaultVariables?: string;
	lowLevelAccess?: boolean;
	hideChatIcon?: boolean;
	lastInteraction?: number;

	//lazy hack for typechecking
	voicevoxConfig?: any;
	ttsSpeech?: string;
	naittsConfig?: any;
	oaiVoice?: string;
	hfTTS?: any;
	vits?: OnnxModelFiles;
	gptSoVitsConfig?: any;
	fishSpeechConfig?: any;
	ttsReadOnlyQuoted?: boolean;
	exampleMessage?: string;
	systemPrompt?: string;
	replaceGlobalNote?: string;
	additionalText?: string;
	personality?: string;
	scenario?: string;
	translatorNote?: string;
	additionalData?: any;
	depth_prompt?: { depth: number; prompt: string };
	additionalAssets?: [string, string, string][];
	utilityBot?: boolean;
	license?: string;
	realmId: string;
	prebuiltAssetCommand?: boolean;
	prebuiltAssetStyle?: string;
	prebuiltAssetExclude?: string[];
	modules?: string[];
}
