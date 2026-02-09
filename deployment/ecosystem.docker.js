module.exports = {
  apps: [
    {
      name: "hela-site",
      script: "server.js",
      cwd: "/app",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      // Inherit all env from container (AUTH_SECRET, AUTH_URL, SITE_URL, etc.)
      merge_logs: true,
      error_file: "/dev/stderr",
      out_file: "/dev/stdout",
    },
  ],
};
