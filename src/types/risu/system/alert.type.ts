import type { MessageGenerationInfo } from "./message.types";

export interface alertData {
	type:
		| "error"
		| "normal"
		| "none"
		| "ask"
		| "wait"
		| "selectChar"
		| "input"
		| "toast"
		| "wait2"
		| "markdown"
		| "select"
		| "login"
		| "tos"
		| "cardexport"
		| "requestdata"
		| "addchar"
		| "hypaV2"
		| "selectModule"
		| "chatOptions"
		| "pukmakkurit"
		| "branches"
		| "progress";
	msg: string;
	submsg?: string;
	datalist?: [string, string][];
	stackTrace?: string;
}

export type AlertGenerationInfoStoreData = {
	genInfo: MessageGenerationInfo;
	idx: number;
};
