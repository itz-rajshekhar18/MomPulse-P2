import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude firebase-admin from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'firebase-admin': 'commonjs firebase-admin',
        '@google-cloud/firestore': 'commonjs @google-cloud/firestore',
        '@opentelemetry/api': 'commonjs @opentelemetry/api',
      });
    }
    return config;
  },
};

export default nextConfig;
