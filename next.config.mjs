/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/c", // 目标地址
        permanent: true, // 如果是永久重定向设为 true，否则为 false
      },
    ];
  },
  images: {
    domains: [
      "picsum.photos",
      "inmove-blog.oss-cn-hangzhou.aliyuncs.com",
      "pbs.twimg.com",
      "inmove-vshop.oss-cn-hangzhou.aliyuncs.com",
    ],
  },
};

export default nextConfig;
