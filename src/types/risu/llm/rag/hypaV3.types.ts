export const DISPLAY_MODE = {
	All: "All",
	Range: "Range",
	Recent: "Recent",
} as const;

export type DisplayMode = (typeof DISPLAY_MODE)[keyof typeof DISPLAY_MODE];

interface Summary {
	text: string;
	chatMemos: Set<string>;
	isImportant: boolean;
}

interface HypaV3Data {
	summaries: Summary[];
	lastSelectedSummaries?: number[]; // legacy
	metrics?: {
		lastImportantSummaries: number[];
		lastRecentSummaries: number[];
		lastSimilarSummaries: number[];
		lastRandomSummaries: number[];
	};
	modalSettings?: {
		displayMode: DisplayMode;
		displayRangeFrom: number;
		displayRangeTo: number;
		displayRecentCount: number;
		displayImportant: boolean;
		displaySelected: boolean;
	};
}

export interface SerializableSummary extends Omit<Summary, "chatMemos"> {
	chatMemos: string[];
}

export interface SerializableHypaV3Data extends Omit<HypaV3Data, "summaries"> {
	summaries: SerializableSummary[];
}
