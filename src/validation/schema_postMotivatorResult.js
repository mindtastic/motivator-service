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
      options: (input, { _, _, path }) => {
        const toPath = ((path) => path.split(/[^\w\d]+/).filter(s => !!s));
        const pathList = toPath(path);
        const key = pathList.at(-1);
        if (Number.isNaN(key)) {
          return false;
        }
        if (!('entries' in input)) {
          return false;
        }
        if (typeof input.entries !== 'JSON') {
          return false;
        }
        return true;
      },
    },
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
