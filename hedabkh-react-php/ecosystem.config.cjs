/**
 * PM2 Production Ecosystem Configuration
 * Gulf Hills Contracting - Visual CMS Platform
 * MANDATORY: Single-Instance Fork Mode Only (Cluster mode is prohibited)
 */

module.exports = {
  apps: [
    {
      name: "hedabkh-portal",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "./",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      restart_delay: 4000,
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      merge_logs: true,
      kill_timeout: 5000,
    },
  ],
};
