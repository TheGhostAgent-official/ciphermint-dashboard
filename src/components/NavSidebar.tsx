"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    title: "Dashboard",
    desc: "Overview of wallets & chain",
  },
  {
    href: "/wallet",
    title: "Wallet",
    desc: "Details for a single address",
  },
  {
    href: "/rackdog",
    title: "Rackdog",
    desc: "Flagship RACKD token view",
  },
  {
    href: "/chain",
    title: "Chain Health",
    desc: "Network status & metrics",
  },
];

export default function NavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="cm-sidebar">
      <div className="cm-sidebar-main">
        <div>
          <div className="cm-sidebar-brand">
            <span>CipherMint</span> Hub
          </div>
          <div className="cm-sidebar-sub">
            Unified view for the CipherMint ecosystem.
          </div>
        </div>

        <div>
          <div className="cm-nav-section-title">Navigate</div>
          <ul className="cm-nav-list">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <li key={item.href} className="cm-nav-item">
                  <Link
                    href={item.href}
                    className={
                      "cm-nav-link" +
                      (active ? " cm-nav-link-active" : "")
                    }
                  >
                    <span className="cm-nav-link-title">
                      {item.title}
                    </span>
                    <span className="cm-nav-link-desc">{item.desc}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="cm-sidebar-footer">
        CipherMint Studios · Demo build
      </div>
    </aside>
  );
}
