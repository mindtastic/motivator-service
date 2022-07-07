const notFoundError = (res, resource = '') => {
  const errorMessage = resource.concat(' not found')
  res.status(404).json({ error: errorMessage });
};

const serverError = (res, err) => {
  res.status(500).json({ error: err });
};

export { notFoundError, serverError, serverSuccess };