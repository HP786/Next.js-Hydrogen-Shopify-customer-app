import { Footer } from '@/components/Footer';
import { TradeHeader } from '@/components/TradeHeader';

export default function MarketingLayout({ children }) {
  return (
    <>
      <TradeHeader />
      {children}
      <Footer variant="trade" />
    </>
  );
}
