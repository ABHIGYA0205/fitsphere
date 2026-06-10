import './globals.css';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Providers from '../components/Providers';

export const metadata = {
  title: 'FitSphere',
  description: 'Your ultimate workout app',
  icons: {
    icon: '/icon.png', 
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-container">
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}