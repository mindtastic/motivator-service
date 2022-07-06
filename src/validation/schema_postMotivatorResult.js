export default {
  timestamp: {
    exists: true,
    isISO8601: true
  },
  status: {
    notEmpty: true,
    isIn: {
        options: ['completed', 'running'],
        errorMessage: 'The status has to be either completed or running'
    },
    errorMessage: 'Missing status'
  },
  value: {
    exists: true,
  },
  feedback: {
    exists: true,
    isInt: {
      options: {
        min: 0,
        max: 10
      }
    }
  },
};
