import { AgentFunctionResult, Agent, ChatMessageBuilder } from "@evo-ninja/agent-utils";
import { AgentBaseContext } from "../AgentBase";
import { AgentFunctionBase } from "../AgentFunctionBase";

interface SetVariableFuncParameters {
  name: string;
  value: string;
}

export class SetVariableFunction extends AgentFunctionBase<SetVariableFuncParameters> {
  name: string = "setVariable";
  description: string = "Set a variable";
  parameters: any = {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of a variable"
      },
      value: {
        type: "string",
        description: "Value to be stored"
      },
    },
    required: ["name", "value"],
    additionalProperties: false,
  };

  buildExecutor(
    _: Agent<unknown>,
    context: AgentBaseContext
  ): (
    params: SetVariableFuncParameters,
    rawParams?: string
  ) => Promise<AgentFunctionResult> {
    return async (
      params: SetVariableFuncParameters,
      rawParams?: string
    ): Promise<AgentFunctionResult> => {
      context.variables.set(params.name, params.value);
      return {
        outputs: [],
        messages: [
          ChatMessageBuilder.functionCall(this.name, rawParams),
          ChatMessageBuilder.functionCallResult(this.name, `Variable ${params.name} stored in context`)
        ],
      };
    };
  }
}
