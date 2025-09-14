import { defaultJailbreak, defaultMainPrompt } from "$lib/templates/defaultPrompts";
import type { BotPreset } from "../../types/risu/preset.types";
import { defaultAIN } from "../../types/risu/tools/additionalmodel/ain.types";
import { defaultOoba } from "../../types/risu/tools/additionalmodel/ooba.types";

export const risupTemplate: BotPreset = {
	name: "New Preset",
	apiType: "gpt35_0301",
	openAIKey: "",
	mainPrompt: defaultMainPrompt,
	jailbreak: defaultJailbreak,
	globalNote: "",
	temperature: 80,
	maxContext: 4000,
	maxResponse: 300,
	frequencyPenalty: 70,
	PresensePenalty: 70,
	formatingOrder: [
		"main",
		"description",
		"personaPrompt",
		"chats",
		"lastChat",
		"jailbreak",
		"lorebook",
		"globalNote",
		"authorNote",
	],
	aiModel: "gpt35_0301",
	subModel: "gpt35_0301",
	currentPluginProvider: "",
	textgenWebUIStreamURL: "",
	textgenWebUIBlockingURL: "",
	forceReplaceUrl: "",
	forceReplaceUrl2: "",
	promptPreprocess: false,
	proxyKey: "",
	bias: [],
	ooba: structuredClone(defaultOoba),
	ainconfig: structuredClone(defaultAIN),
	reverseProxyOobaArgs: {
		mode: "instruct",
	},
	top_p: 1,
	useInstructPrompt: false,
	verbosity: 1,
};
