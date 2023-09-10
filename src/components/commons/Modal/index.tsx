import { useStack } from '@/utils/hooks/useStack';

export const stack = useStack<{ symbol: symbol; index: number }, {}>([], (stack, origin) => {
  const max = stack.stack.reduce((pve, aft) => {
    if (aft.key === origin.symbol) {
      return pve;
    } else if (aft.payload.index > pve) {
      return aft.payload.index;
    }
    return pve;
  }, 1);

  origin.index = max + 1;

  return stack.toStack(origin.symbol, origin);
});