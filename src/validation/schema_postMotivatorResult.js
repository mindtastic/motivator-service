export default {
  timestamp: {
    exists: true,
    isISO8601: true,
  },
  values: {
    exists: true,
  },
  'values.*': {
    custom: {
      options: (input, { req, location, path }) => {
        const toPath = (path) => path.split(/[^\w\d]+/).filter(s => !!s);
        const path = toPath(path);
        const key = path.at(-1);
        if (isNaN(key)) {
          return false;
        }
        if (!('entries' in input)) {
          return false
        }
        if (typeof input.entries != JSON) {
          return false
        }
      },
    }
  },
  'feedback.rating': {
    notEmpty: true,
    isIn: {
      options: ['positive', 'neutral', 'negative'],
      errorMessage: 'The feedback has to be either positive, neutral or negative',
    },
    errorMessage: 'Expected property feedback with feedback.rating: `postive`|`neutral`|`negative`',
  },
};
