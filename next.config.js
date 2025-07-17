/** @type {import("next").NextConfig} */
const nextConfig = {
reactStrictMode: true,
env: {
 NEXT_PUBLIC_ETHEREUM_WS_URL: process.env.NEXT_PUBLIC_ETHEREUM_WS_URL,
 NEXT_PUBLIC_POLYGON_WS_URL: process.env.NEXT_PUBLIC_POLYGON_WS_URL,
 NEXT_PUBLIC_ARBITRUM_WS_URL: process.env.NEXT_PUBLIC_ARBITRUM_WS_URL,
 NEXT_PUBLIC_UNISWAP_V3_POOL_ADDRESS: process.env.NEXT_PUBLIC_UNISWAP_V3_POOL_ADDRESS,
},
webpack: (config) => {
 config.resolve.fallback = {
   ...config.resolve.fallback,
   fs: false,
   net: false,
   tls: false,
 };
 return config;
},
};

module.exports = nextConfig;
