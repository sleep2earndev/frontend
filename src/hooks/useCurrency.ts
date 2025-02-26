export default function useCurrency() {
  const convertWei = (wei: number, decimals: number) =>
    Number(wei) / 10 ** decimals;
  return { convertWei };
}
