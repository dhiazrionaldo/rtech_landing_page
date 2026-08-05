import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CLAUDE.md's code conventions assume the React Compiler is on, so no
  // hand-written useMemo/useCallback. Requires babel-plugin-react-compiler.
  reactCompiler: true,

  async redirects() {
    return [
      // Every route lives under /[locale]; send the bare root to Indonesian,
      // which is the default locale and the x-default hreflang target.
      //
      // Permanent (308), not temporary (307): the destination never varies by
      // user or session, and a 307 tells Google to keep the root as the
      // indexable URL rather than consolidating link signals onto /id.
      { source: "/", destination: "/id", permanent: true },
    ];
  },
};

export default nextConfig;
