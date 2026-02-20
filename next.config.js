/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Content Security Policy
const CSP = [
  "default-src 'self'",
  `connect-src 'self' ${API_URL}`,
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed by Next.js dev
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ')

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: API_URL,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Clickjacking protection
          { key: 'X-Frame-Options', value: 'DENY' },
          // Legacy XSS filter
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // HSTS (1 year, include subdomains)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy - disable unused browser APIs
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
          // Content Security Policy
          { key: 'Content-Security-Policy', value: CSP },
          // Prevent browser from sending DNS prefetch
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
  // Security: hide powered-by header
  poweredByHeader: false,
}

module.exports = nextConfig
