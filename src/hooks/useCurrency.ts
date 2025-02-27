export default function useCurrency() {
  const convertWei = (wei: number, decimals: number) =>
    Number(wei) / 10 ** decimals;

  const convertTokenIdNft = (tokenId: string) => Number(BigInt(tokenId).toString())
  return { convertWei, convertTokenIdNft };
}
