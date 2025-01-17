import {
  Timeout,
  AgentOutput,
  RunResult
} from "@evo-ninja/agent-utils";
import { AgentContext } from "@evo-ninja/agent-utils";
import { DelegateAgentFunction } from "../../functions/DelegateAgentFunction";
import { VerifyGoalAchievedFunction } from "../../functions/VerifyGoalAchieved";
import { prompts } from "./prompts";
import { ScripterAgent } from "../Scripter";
import { Agent, AgentConfig, GoalRunArgs } from "../utils";
import { CsvAnalystAgent } from "../CsvAnalyst";
import { DeveloperAgent } from "../Developer";
import { ResearcherAgent } from "../Researcher";

export type AgentOrFactory = (Agent | (() => Agent));

export class Evo extends Agent {
  constructor(
    context: AgentContext,
    timeout?: Timeout,
    delegatedAgents?: AgentOrFactory[]
  ) {
    const verifyGoalAchievedFn = new VerifyGoalAchievedFunction(context.llm, context.chat.tokenizer);

    delegatedAgents = delegatedAgents ?? [
      DeveloperAgent,
      ResearcherAgent,
      CsvAnalystAgent,
      ScripterAgent,
    ].map(agentClass => () => new agentClass(context.cloneEmpty()));

    super(
      new AgentConfig(
        (_, onGoalFailedFn) => prompts(verifyGoalAchievedFn, onGoalFailedFn),
        [
          verifyGoalAchievedFn,
          ...delegatedAgents.map((x) => new DelegateAgentFunction(x, context.llm, context.chat.tokenizer)),
        ],
        context.scripts,
        timeout
      ),
      context,
    );
  }

  public async* run(
    args: GoalRunArgs
  ): AsyncGenerator<AgentOutput, RunResult, string | undefined> {
    // To help Evo determine what agents to delegate to,
    // we first read the files contained within the directory
    const files = this.context.workspace.readdirSync("./");
    this.context.chat.temporary({
      role: "user",
      content: `Files: ${
        files.filter((x) => x.type === "file").map((x) => x.name).join(", ")
      }\nDirectories: ${
        files.filter((x) => x.type === "directory").map((x) => x.name).join(", ")
      }`
    });

    return yield* super.run(args);
  }
}
