import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CLAUDE.md's code conventions assume the React Compiler is on, so no
  // hand-written useMemo/useCallback. Requires babel-plugin-react-compiler.
  reactCompiler: true,

  async redirects() {
    return [
      // Every route lives under /[locale]; send the bare root to Indonesian,
      // which is the default locale and the x-default hreflang target.
      { source: "/", destination: "/id", permanent: false },
    ];
  },
};

export default nextConfig;
