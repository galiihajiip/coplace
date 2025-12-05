import { Coffee, Instagram, Twitter, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Threads', path: '/threads' },
    { label: 'Tentang Kami', path: '/about' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'Github' },
  ];

  return (
    <footer className="bg-coplace-bg border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="text-coplace-orange" size={24} />
              <span className="text-xl font-bold text-gradient">COPLACE</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Marketplace kopi lokal Indonesia dengan AI Barista. 
              Temukan kopi terbaik dari petani lokal langsung ke cangkirmu.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Link Cepat</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-coplace-orange transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Ikuti Kami</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-3 bg-white/5 hover:bg-coplace-orange/20 rounded-xl transition-colors group"
                >
                  <social.icon 
                    size={20} 
                    className="text-white/60 group-hover:text-coplace-orange transition-colors" 
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-white/40 text-sm">
            © 2024 COPLACE. Made with ☕ for Indonesian Coffee Lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
