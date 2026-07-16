import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function ShopLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
