const getResultInputs = (result_id) => [
  {
    value: JSON.stringify({
      5: {
        entries: {
          'text-question': {
            value: 'Cage the Elephant',
          },
          'range-rating': {
            value: 9,
          },
        },
      },
    }),
    motivator_result_id: result_id,
  },
];

export default getResultInputs;
