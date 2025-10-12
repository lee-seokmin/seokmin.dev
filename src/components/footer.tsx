export default function Footer() {
  return (
    <footer className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-foreground px-12 py-6 rounded-lg">
        {/* Brand Section */}
        <div className="space-y-2 self-center">
          <h3 className="text-xl font-bold text-background">SEOKMIN.DEV</h3>
          <p className="text-muted-foreground text-background text-sm">
            Personal portfolio and blog showcasing development projects and thoughts.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2 self-center">
          <h4 className="text-lg font-semibold text-background">Quick Links</h4>
          <nav className="flex flex-col space-y-2">
            <a href="/" className="text-muted-foreground hover:text-background transition-colors text-sm">
              Home
            </a>
            <a href="/blog" className="text-muted-foreground hover:text-background transition-colors text-sm">
              Blog
            </a>
            <a href="/craft" className="text-muted-foreground hover:text-background transition-colors text-sm">
              Craft
            </a>
          </nav>
        </div>

        {/* Contact & Social */}
        <div className="space-y-2 self-center justify-self-start md:justify-self-end">
          <h4 className="text-lg font-semibold text-background">Connect</h4>
          <div className="flex flex-col space-y-2">
            <a
              href="mailto:dltjrals13@naver.com"
              className="text-muted-foreground hover:text-background transition-colors text-sm"
            >
              dltjrals13@naver.com
            </a>
            <div className="flex space-x-4">
              <a
                href="https://github.com/lee-soekmin"
                className="text-muted-foreground hover:text-background transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="py-4 text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} 이석민 All rights reserved.
        </p>
      </div>
    </footer>
  );
}