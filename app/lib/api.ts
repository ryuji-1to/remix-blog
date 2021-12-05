export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
};
