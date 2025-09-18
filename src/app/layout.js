import { Elsie, Montserrat } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../app/Styles/custom.css'
import '../app/Styles/header.css'
import '../app/Styles/HeaderStyle.css'
import '../app/Styles/inner-hero.css'
import '../app/Styles/style.css'
import '../app/Styles/styleblog.css'
import '../app/Styles/globals.css'
import '../app/Styles/responsive.css'
import "./globals.css";
import Footer from './Common/Footer';
import { AuthProvider } from '@/context/AuthContext';

const elsie = Elsie({
  weight: ['400', '900'],
  subsets: ['latin'],
  variable: '--font-elsie',
  display: 'swap',
});

const montserrat = Montserrat({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: 'Hotels and Resorts in India - Amritara Hotels',
  description: 'Amritara Hotels- A group of hotels with the best luxury and heritage hotels and resorts in India. Stay in the best accommodations with all the contemporary amenities. Book now.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${elsie.variable} ${montserrat.variable}`}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
