export const calculateRating = (evals?: number[]) => {
  if (!evals || evals.length === 0) return { rating: 0, count: 0 };
  const sum = evals.reduce((a, b) => a + b, 0);
  return {
    rating: parseFloat((sum / evals.length).toFixed(1)),
    count: evals.length,
  };
};
