export default {
  name: {
    isLength: {
      errorMessage: 'Name cannot be longer than 255 characters',
      // Multiple options would be expressed as an array
      options: { max: 255 },
    },
    exists: true,
  },
  headline: {
    isLength: {
      errorMessage: 'Headline cannot be longer than 255 characters',
      // Multiple options would be expressed as an array
      options: { max: 255 },
    },
    exists: true,
  },
  'content.*.type': {
    exists: true,
    isString: true,
  },
  content: {
    isArray: true,
    customSanitizer: {
      // eslint-disable-next-line max-len
      options: (value) => (value.map((item, index) => ({ content: JSON.stringify(item), ordering: index }))),
    },
  },
  inputs: {
    isArray: true,
    customSanitizer: {
      options: (value) => (value.map((item) => ({ value: JSON.stringify(item) }))),
    },
  },
};
