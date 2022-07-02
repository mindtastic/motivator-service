const getResults = (userId, motivatorId) => [
  {
    status: 'completed',
    timestamp: Date.now(),
    feedback: 'neutral',
    user_id: userId,
    motivator_id: motivatorId,
  },
];

export default getResults;
