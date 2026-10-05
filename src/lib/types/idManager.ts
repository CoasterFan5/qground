let counter = 0;

export const getId = () => {
  counter += 1;
  const randomComponents = [
    Date.now().toString(16),
    (Math.random() * 100_000_000_000).toString(16),
    (Math.random() * 100_000_000_000).toString(16),
    counter.toString()
  ]
  return randomComponents.join("-")
}
