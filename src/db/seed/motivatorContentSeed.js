const getContents = (motivatorId) => [
  {
    ordering: 0,
    content: JSON.stringify(
      {
        type: 'text',
        value: 'whatever',
      },
    ),
    motivator_id: motivatorId,
  },
  {
    ordering: 1,
    content: JSON.stringify(
      {
        type: 'input',
        inputId: 5,
      },
    ),
    motivator_id: motivatorId,
  },
];

export default getContents;
