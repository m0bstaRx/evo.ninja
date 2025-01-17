export const onGoalAchievedScript = {
  name: "agent.onGoalAchieved",
  definition: `{
  "name":"agent.onGoalAchieved",
  "description":"Informs the user that the goal has been achieved.",
  "arguments":"None",
  "code":"./agent.onGoalAchieved.js"
}`,
  code: `return __wrap_subinvoke(
  'plugin/agent',
  'onGoalAchieved',
  { }
).value
`
};

export const onGoalFailedScript = {
  name: "agent.onGoalFailed",
  definition: `{
  "name":"agent.onGoalFailed",
  "description":"Informs the user that the agent could not achieve the goal.",
  "arguments":"None",
  "code":"./agent.onGoalFailed.js"
}`,
  code: `return __wrap_subinvoke(
  'plugin/agent',
  'onGoalFailed',
  { }
).value
`
};

export const speakScript = {
  name: "agent.speak",
  definition: `{
    "name":"agent.speak",
    "description":"Informs the user by sending a message.",
    "arguments":"{ message: string }",
    "code":"./agent.speak.js"
}`,
  code: `return __wrap_subinvoke(
  'plugin/agent',
  'speak',
  { message: message }
).value
`
};
