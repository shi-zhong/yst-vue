export const Round = (x: number, precision: number): number => {
  return (
    Math.floor(x * Math.pow(10, precision) + 0.5) / Math.pow(10, precision)
  );
};

export default { Round };