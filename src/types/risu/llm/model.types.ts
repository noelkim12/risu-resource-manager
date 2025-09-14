import type { Parameter } from "./llm.param.types";

export enum LLMFlags {
    hasImageInput,
    hasImageOutput,
    hasAudioInput,
    hasAudioOutput,
    hasPrefill,
    hasCache,
    hasFullSystemPrompt,
    hasFirstSystemPrompt,
    hasStreaming,
    requiresAlternateRole,
    mustStartWithUserInput,
    poolSupported,
    hasVideoInput,
    OAICompletionTokens,
    DeveloperRole,
    geminiThinking,
    geminiBlockOff,
    deepSeekPrefix,
    deepSeekThinkingInput,
    deepSeekThinkingOutput,
    noCivilIntegrity,
    claudeThinking,
  }
  
  export enum LLMProvider {
    OpenAI,
    Anthropic,
    GoogleCloud,
    VertexAI,
    AsIs,
    Mistral,
    NovelList,
    Cohere,
    NovelAI,
    WebLLM,
    Horde,
    AWS,
    AI21,
    DeepSeek,
    DeepInfra,
  }
  
  export enum LLMFormat {
    OpenAICompatible,
    OpenAILegacyInstruct,
    Anthropic,
    AnthropicLegacy,
    Mistral,
    GoogleCloud,
    VertexAIGemini,
    NovelList,
    Cohere,
    NovelAI,
    WebLLM,
    OobaLegacy,
    Plugin,
    Ooba,
    Kobold,
    Ollama,
    Horde,
    AWSBedrockClaude,
    OpenAIResponseAPI,
  }
  
  export enum LLMTokenizer {
    Unknown,
    tiktokenCl100kBase,
    tiktokenO200Base,
    Mistral,
    Llama,
    NovelAI,
    Claude,
    NovelList,
    Llama3,
    Gemma,
    GoogleCloud,
    Cohere,
    Local,
    DeepSeek,
  }
  
  export interface LLMModel {
    id: string;
    name: string;
    shortName?: string;
    fullName?: string;
    internalID?: string;
    provider: LLMProvider;
    flags: LLMFlags[];
    format: LLMFormat;
    parameters: Parameter[];
    tokenizer: LLMTokenizer;
    recommended?: boolean;
    keyIdentifier?: string;
    endpoint?: string;
  }
