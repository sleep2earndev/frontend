export default function useCurrency() {
  const convertWei = (wei: number, decimals: number) =>
    Number(wei) / 10 ** decimals;

  function fromWeiToEth(wei: number) {

    return (Number(wei) / 1e18);
  }

  const convertTokenIdNft = (tokenId: string) =>
    Number(BigInt(tokenId).toString());
  return { convertWei, convertTokenIdNft, fromWeiToEth };
}
