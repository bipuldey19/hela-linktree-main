module.exports = {
  apps: [
    // Option A: Full repo deploy (has node_modules + .next) – use next start
    {
      name: "hela-site",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/hela-site",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    // Option B: Standalone deploy (copy .next/standalone + .next/static + public to server)
    // { name: "hela-site", script: "server.js", cwd: "/var/www/hela-site", instances: 1, autorestart: true, env: { NODE_ENV: "production", PORT: 3000 } },
  ],
};
