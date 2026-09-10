import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-[#2B2B2B] text-white">
      <div className="container-xl grid gap-10 py-12 md:grid-cols-4">
        <div>
          <h3 className="font-heading text-lg font-semibold">Sovilo&apos;s Aesthetics</h3>
          <p className="mt-3 text-sm text-gray-300">
            Premium aesthetic laser treatments by qualified medical professionals. Serving Pune for
            over 20 years with advanced, safe and effective treatments.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
            Quick Links
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-primary-light transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-primary-light transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary-light transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary-light transition-colors">
                Contact Us
              </Link>
            </li>
            <li className="pt-2 border-t border-white/10">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-light transition-colors"
              >
                <Lock className="h-3 w-3" />
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
            Our Services
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Laser Hair Removal</li>
            <li>Hydrafacial</li>
            <li>PRP Hair Treatment</li>
            <li>Weight Loss Programs</li>
            <li>Botox Treatment</li>
            <li>PCOS Management</li>
            <li>Pain Management</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
            Get In Touch
          </h4>
          <p className="mt-3 text-sm text-gray-300">
            3rd Floor, Velsignet Vista
            <br />
            Pan Card Club Road, Baner
            <br />
            Pune - 411045
          </p>
          <p className="mt-3 text-sm text-gray-300">
            Phone: 8177955821 / 9545507585
            <br />
            Email: holisticclinicsbaner@gmail.com
          </p>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Social Media
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <a
                href="https://www.instagram.com/sovi_los_asthetic_clinc__baner/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/5 px-3 py-1 font-medium text-pink-300 hover:bg-white/10"
              >
                Instagram
              </a>
              <a
                href="#"
                className="rounded-full bg-white/5 px-3 py-1 font-medium text-red-300 hover:bg-white/10"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#1A1A1A] py-4 text-center text-xs text-gray-400 flex items-center justify-center gap-4">
        <span>© {year} Sovilo&apos;s Aesthetics. All Rights Reserved.</span>
        <span className="text-gray-600">|</span>
        <Link to="/admin/login" className="text-gray-500 hover:text-gray-300">
          Staff Login
        </Link>
      </div>
    </footer>
  );
}
