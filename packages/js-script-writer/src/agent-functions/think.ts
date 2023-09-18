import { ResultOk } from "@polywrap/result";
import { AgentFunction, AgentFunctionResult, AgentChatMessage } from "@evo-ninja/agent-utils";
import { AgentContext } from "../AgentContext";
import { OTHER_EXECUTE_FUNCTION_OUTPUT, FUNCTION_CALL_FAILED } from "../prompts";

const FN_NAME = "think";

export const think: AgentFunction<AgentContext> = {
  definition: {
    name: FN_NAME,
    description: `Think.`,
    parameters: {
      type: "object",
      properties: {
        thoughts: {
          type: "string",
          description: "Your current thoughts about the topic."
        },
      },
      required: ["thoughts"],
      additionalProperties: false
    },
  },
  buildChatMessage(args: any, result: AgentFunctionResult): AgentChatMessage {
    const argsStr = JSON.stringify(args, null, 2);

    return result.ok
      ? {
          type: "success",
          title: `Thinking...`,
          content: 
            `## Function Call:\n\`\`\`javascript\n${FN_NAME}(${argsStr})\n\`\`\`\n` +
            OTHER_EXECUTE_FUNCTION_OUTPUT(result.value),
        }
      : {
          type: "error",
          title: `Failed to think!`,
          content: FUNCTION_CALL_FAILED(FN_NAME, result.error, args),
        };
  },
  buildExecutor(context: AgentContext) {
    return async (options: { thoughts: string }): Promise<AgentFunctionResult> => {
      return ResultOk(`I think: ${options.thoughts}.`);
    };
  }
};
