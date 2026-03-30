import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-700 flex items-center justify-center text-white text-sm font-bold">
                CV
              </div>
              <span className="font-semibold text-text-primary">CortexVault</span>
            </div>
            <p className="text-sm text-text-secondary">
              Secure neural data management on Web3
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-text-primary">Product</h4>
            <Link href="/patient" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
              Patient Dashboard
            </Link>
            <Link href="/researcher" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
              Researcher Dashboard
            </Link>
            <Link href="/" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
              Home
            </Link>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-text-primary">Resources</h4>
            <a href="#" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
              Documentation
            </a>
            <a href="#" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
              FAQ
            </a>
            <a href="#" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
              Support
            </a>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-text-primary">Legal</h4>
            <a href="#" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-secondary">
              © {currentYear} CortexVault. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
                GitHub
              </a>
              <a href="#" className="text-sm text-text-secondary hover:text-primary-700 transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
