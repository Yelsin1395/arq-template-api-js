export const mapToSession = (input) => ({
  status: 200,
  sessionId: input.sessionId,
  intent: input.intent,
  user: {
    name: input.user?.name,
    documentNumber: input.user?.documentNumber,
    geolocation: { ...input.user?.geolocation },
  },
  hasSearch: !!input.hasSearch,
  search: { ...input.search },
  isError: false,
  agentResponse: input.agent_response,
  timestamp: input.timestamp,
});
