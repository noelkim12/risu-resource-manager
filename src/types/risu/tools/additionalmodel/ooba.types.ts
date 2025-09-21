export interface OobaChatCompletionRequestParams {
  mode: "instruct" | "chat" | "chat-instruct";
  turn_template?: string;
  name1_instruct?: string;
  name2_instruct?: string;
  context_instruct?: string;
  system_message?: string;
  name1?: string;
  name2?: string;
  context?: string;
  greeting?: string;
  chat_instruct_command?: string;
  preset?: string; // The '?' denotes that the property is optional
  tokenizer?: string;
  min_p?: number;
  top_k?: number;
  repetition_penalty?: number;
  repetition_penalty_range?: number;
  typical_p?: number;
  tfs?: number;
  top_a?: number;
  epsilon_cutoff?: number;
  eta_cutoff?: number;
  guidance_scale?: number;
  negative_prompt?: string;
  penalty_alpha?: number;
  mirostat_mode?: number;
  mirostat_tau?: number;
  mirostat_eta?: number;
  temperature_last?: boolean;
  do_sample?: boolean;
  seed?: number;
  encoder_repetition_penalty?: number;
  no_repeat_ngram_size?: number;
  min_length?: number;
  num_beams?: number;
  length_penalty?: number;
  early_stopping?: boolean;
  truncation_length?: number;
  max_tokens_second?: number;
  custom_token_bans?: string;
  auto_max_new_tokens?: boolean;
  ban_eos_token?: boolean;
  add_bos_token?: boolean;
  skip_special_tokens?: boolean;
  grammar_string?: string;
}

export interface OobaSettings {
  max_new_tokens: number;
  do_sample: boolean;
  temperature: number;
  top_p: number;
  typical_p: number;
  repetition_penalty: number;
  encoder_repetition_penalty: number;
  top_k: number;
  min_length: number;
  no_repeat_ngram_size: number;
  num_beams: number;
  penalty_alpha: number;
  length_penalty: number;
  early_stopping: boolean;
  seed: number;
  add_bos_token: boolean;
  truncation_length: number;
  ban_eos_token: boolean;
  skip_special_tokens: boolean;
  top_a: number;
  tfs: number;
  epsilon_cutoff: number;
  eta_cutoff: number;
  formating: {
    header: string;
    systemPrefix: string;
    userPrefix: string;
    assistantPrefix: string;
    seperator: string;
    useName: boolean;
  };
}

export const defaultOoba: OobaSettings = {
  max_new_tokens: 180,
  do_sample: true,
  temperature: 0.7,
  top_p: 0.9,
  typical_p: 1,
  repetition_penalty: 1.15,
  encoder_repetition_penalty: 1,
  top_k: 20,
  min_length: 0,
  no_repeat_ngram_size: 0,
  num_beams: 1,
  penalty_alpha: 0,
  length_penalty: 1,
  early_stopping: false,
  seed: -1,
  add_bos_token: true,
  truncation_length: 4096,
  ban_eos_token: false,
  skip_special_tokens: true,
  top_a: 0,
  tfs: 1,
  epsilon_cutoff: 0,
  eta_cutoff: 0,
  formating: {
    header:
      "Below is an instruction that describes a task. Write a response that appropriately completes the request.",
    systemPrefix: "### Instruction:",
    userPrefix: "### Input:",
    assistantPrefix: "### Response:",
    seperator: "",
    useName: false,
  },
};
