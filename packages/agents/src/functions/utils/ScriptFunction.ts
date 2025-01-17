import {
  AgentFunctionResult,
  AgentOutputType,
  ChatMessageBuilder,
  JsEngine,
  JsEngine_GlobalVar,
  Scripts,
  shimCode
} from "@evo-ninja/agent-utils"
import { Agent } from "../../agents/utils";
import { AgentFunctionBase } from "./AgentFunctionBase";

export abstract class ScriptFunction<TParams> extends AgentFunctionBase<TParams> {
  constructor(private scripts: Scripts, private storeInVariable?: boolean) {
    super();
  }

  get description(): string {
    const scriptName = this.name.split("_").join(".");
    const script = this.scripts.getScriptByName(scriptName);

    if (!script) {
      throw new Error(`Unable to find the script ${scriptName}`);
    }

    return script.description;
  }

  onSuccess(agent: Agent, params: any, rawParams: string | undefined, result: string): AgentFunctionResult {
    return {
      outputs: [
        {
          type: AgentOutputType.Success,
          title: `[${agent.config.prompts.name}] ${this.name}`,
          content: `${params.query}`
        }
      ],
      messages: [
        ChatMessageBuilder.functionCall(this.name, rawParams || params),
        ChatMessageBuilder.functionCallResult(this.name, result)
      ],
      storeInVariable: this.storeInVariable
    }
  }

  onFailure(agent: Agent, params: any, rawParams: string | undefined, error: string): AgentFunctionResult {
    return {
      outputs: [
        {
          type: AgentOutputType.Error,
          title: `[${agent.config.prompts.name}] Error in ${this.name}: ${error}`
        }
      ],
      messages: [
        ChatMessageBuilder.functionCall(this.name, rawParams || JSON.stringify(params)),
        ChatMessageBuilder.functionCallResult(this.name, `Error: ${error}`)
      ]
    }
  }

  buildExecutor(agent: Agent<unknown>): (params: TParams, rawParams?: string) => Promise<AgentFunctionResult> {
    const { context } = agent;
    return async (params: any, rawParams?: string): Promise<AgentFunctionResult> => {
      const scriptName = this.name.split("_").join(".");
      const script = context.scripts.getScriptByName(scriptName);

      if (!script) {
        return this.onFailure(agent, params, rawParams, `Unable to find the script ${scriptName}`);
      }

      const globals: JsEngine_GlobalVar[] = Object.entries(params).map(
        (entry) => ({
          name: entry[0],
          value: JSON.stringify(entry[1])
        })
      );

      const jsEngine = new JsEngine(context.client);
      const result = await jsEngine.evalWithGlobals({
        src: shimCode(script.code),
        globals
      });

      if (result.ok) {
        if (result.value.error == null) {
          const jsPromiseOutput = context.client.jsPromiseOutput;
          if (jsPromiseOutput.ok) {
            const result = typeof jsPromiseOutput.value !== "string" ? JSON.stringify(jsPromiseOutput.value) : jsPromiseOutput.value;
            return this.onSuccess(agent, params, rawParams, result);
          } else {
            return this.onFailure(agent, params, rawParams, jsPromiseOutput.error.message);
          }
        } else {
          return this.onFailure(agent, params, rawParams, result.value.error.toString());
        }
      } else {
        return this.onFailure(agent, params, rawParams,result.error?.toString() ?? "Unknown error");
      }
    };
  }
}
