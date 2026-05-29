import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
	output: "standalone",
	reactStrictMode: true,
	poweredByHeader: false,
	allowedDevOrigins: ["192.168.102.91", "192.168.8.4"],
	experimental: {
		optimizePackageImports: ["lucide-react", "@base-ui/react"],
	},
};

export default withNextIntl(nextConfig);
