const getInputs = (resultId) => [
  {
    value: JSON.stringify({
      id: 5,
      fields: {
        'text-question': {
          inputType: 'text',
          label: "What's the elephant in the room?",
        },
        'range-rating': {
          inputType: 'range',
          label: 'On a scale from 1-10. How important is privacy engineering to you?',
          options: {
            minValue: 1,
            maxValue: 10,
          },
        },
      },
    }),
    result_id: resultId,
  },
];

export default getInputs;
