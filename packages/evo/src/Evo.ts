import { agentFunctions } from "./agent-functions";
import { AgentContext } from "./AgentContext";
import { Scripts } from "./Scripts";
import { WrapClient } from "./wrap";
import {
  GOAL_PROMPT,
  INITIAL_PROMP,
  LOOP_PREVENTION_PROMPT
} from "./prompts";

import {
  Agent,
  Workspace,
  LlmApi,
  Chat,
  Logger,
  StepOutput,
  RunResult,
  Timeout,
  InMemoryWorkspace,
  executeAgentFunction,
  basicFunctionCallLoop
} from "@evo-ninja/agent-utils";
import { ScriptWriter } from "@evo-ninja/js-script-writer-agent";
import { IWrapPackage } from "@polywrap/client-js";
import { ResultErr } from "@polywrap/result";

export class Evo implements Agent {
  private readonly context: AgentContext

  constructor(
    private readonly llm: LlmApi,
    private readonly chat: Chat,
    private readonly logger: Logger,
    private readonly workspace: Workspace,
    private readonly agentPackage: IWrapPackage,
    scripts: Scripts,
    private readonly timeout?: Timeout
  ) {
    this.context = {
      llm,
      chat,
      workspace,
      scripts,
      logger,
      globals: {},
      client: new WrapClient(
        this.workspace,
        this.logger,
        this.agentPackage
      ),
    };
  }

  public async* run(goal: string): AsyncGenerator<StepOutput, RunResult, string | undefined> {
    const { chat } = this.context;
    const createScriptWriter = (): ScriptWriter => {
      const workspace = new InMemoryWorkspace();
      const chat = new Chat(workspace, this.llm, this.chat.tokenizer, this.logger);
      return new ScriptWriter(this.llm, chat, this.logger, workspace);
    };

    if (this.timeout) {
      setTimeout(this.timeout.callback, this.timeout.milliseconds);
    }

    try {
      chat.persistent("system", INITIAL_PROMP);
      chat.persistent("system", GOAL_PROMPT(goal));
      
      return yield* basicFunctionCallLoop(
        this.context,
        executeAgentFunction,
        agentFunctions(createScriptWriter),
        LOOP_PREVENTION_PROMPT
      );
    } catch (err) {
      this.logger.error(err);
      return ResultErr("Unrecoverable error encountered.");
    }
  }
}
