export type ValueOf<T> = T[keyof T];
export type MapTo<T, U> = {
  [P in keyof T]: U
};

export function mapObject<T extends object, U>(obj: T, mapFn: (v: ValueOf<T>) => U): MapTo<T, U> {
  return Object.keys(obj).reduce((acc, key) => ({
    [key]: mapFn(obj[key as keyof T]),
    ...acc,
  }), {} as MapTo<T, U>);
}

// eslint-disable-next-line max-len
export function formatMotivator(motivator: { MotivatorContents: Array<any>, MotivatorInputs: Array<any> }) {
  const { MotivatorContents, MotivatorInputs, ...resultFormatted } = {
    ...motivator,
    content: motivator.MotivatorContents.map((x) => JSON.parse(x.content)),
    inputs: motivator.MotivatorInputs.map((x) => JSON.parse(x.value)),
  };

  return resultFormatted;
}

export default {
  mapObject,
  formatMotivator,
};
