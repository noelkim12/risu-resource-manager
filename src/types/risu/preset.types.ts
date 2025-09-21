import type { PromptItem, PromptSettings } from "./llm/prompts.types";
import type { LLMFlags, LLMFormat } from "./llm/model.types";
import type {
  OobaChatCompletionRequestParams,
  OobaSettings,
} from "./tools/additionalmodel/ooba.types";
import type { NAISettings } from "./tools/stablediffusion/nai.types";
import type { AINsettings } from "./tools/additionalmodel/ain.types";
import type { SeparateParameters } from "./llm/parameter.types";

export interface RisupFile {
  presetVersion: number;
  type: string;
  preset?: Uint8Array;
  pres?: Uint8Array;
}

export interface BotPreset {
  name?: string;
  apiType?: string;
  openAIKey?: string;
  mainPrompt: string;
  jailbreak: string;
  globalNote: string;
  temperature: number;
  maxContext: number;
  maxResponse: number;
  frequencyPenalty: number;
  PresensePenalty: number;
  formatingOrder: FormatingOrderItem[];
  aiModel?: string;
  subModel?: string;
  currentPluginProvider?: string;
  textgenWebUIStreamURL?: string;
  textgenWebUIBlockingURL?: string;
  forceReplaceUrl?: string;
  forceReplaceUrl2?: string;
  promptPreprocess: boolean;
  bias: [string, number][];
  proxyRequestModel?: string;
  openrouterRequestModel?: string;
  proxyKey?: string;
  ooba: OobaSettings;
  ainconfig: AINsettings;
  koboldURL?: string;
  NAISettings?: NAISettings;
  autoSuggestPrompt?: string;
  autoSuggestPrefix?: string;
  autoSuggestClean?: boolean;
  promptTemplate?: PromptItem[];
  NAIadventure?: boolean;
  NAIappendName?: boolean;
  localStopStrings?: string[];
  customProxyRequestModel?: string;
  reverseProxyOobaArgs?: OobaChatCompletionRequestParams;
  top_p?: number;
  promptSettings?: PromptSettings;
  repetition_penalty?: number;
  min_p?: number;
  top_a?: number;
  openrouterProvider?: string;
  useInstructPrompt?: boolean;
  customPromptTemplateToggle?: string;
  templateDefaultVariables?: string;
  moduleIntergration?: string;
  top_k?: number;
  instructChatTemplate?: string;
  JinjaTemplate?: string;
  jsonSchemaEnabled?: boolean;
  jsonSchema?: string;
  strictJsonSchema?: boolean;
  extractJson?: string;
  groupTemplate?: string;
  groupOtherBotRole?: string;
  seperateParametersEnabled?: boolean;
  seperateParameters?: {
    memory: SeparateParameters;
    emotion: SeparateParameters;
    translate: SeparateParameters;
    otherAx: SeparateParameters;
  };
  customAPIFormat?: LLMFormat;
  systemContentReplacement?: string;
  systemRoleReplacement?: "user" | "assistant";
  openAIPrediction?: string;
  enableCustomFlags?: boolean;
  customFlags?: LLMFlags[];
  image?: string;
  regex?: CustomScript[];
  reasonEffort?: number;
  thinkingTokens?: number;
  outputImageModal?: boolean;
  seperateModelsForAxModels?: boolean;
  seperateModels?: {
    memory: string;
    emotion: string;
    translate: string;
    otherAx: string;
  };
  modelTools?: string[];
  fallbackModels?: {
    memory: string[];
    emotion: string[];
    translate: string[];
    otherAx: string[];
    model: string[];
  };
  fallbackWhenBlankResponse?: boolean;
  verbosity: number;
  dynamicOutput?: DynamicOutput;
  generationSeed?: number;
  reasoning_effort?: number;
  openrouterMiddleOut: boolean;
  openrouterFallback: boolean;
  reverseProxyOobaMode: boolean;
}

export type FormatingOrderItem =
  | "main"
  | "jailbreak"
  | "chats"
  | "lorebook"
  | "globalNote"
  | "authorNote"
  | "lastChat"
  | "description"
  | "postEverything"
  | "personaPrompt";

export interface DynamicOutput {
  autoAdjustSchema: boolean;
  dynamicMessages: boolean;
  dynamicMemory: boolean;
  dynamicResponseTiming: boolean;
  dynamicOutputPrompt: boolean;
  showTypingEffect: boolean;
  dynamicRequest: boolean;
}

export interface CustomScript {
  comment: string;
  in: string;
  out: string;
  type: string;
  flag?: string;
  ableFlag?: boolean;
}
