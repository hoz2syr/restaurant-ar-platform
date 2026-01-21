module.exports = {
  apps: [
    {
      name: 'restaurant-api',
      script: 'dist/main.js',
      cwd: './apps/api',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        API_PORT: 3001,
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      merge_logs: true,
      time: true,
    },
    {
      name: 'restaurant-admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      cwd: './apps/admin',
      instances: 1,
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/admin-error.log',
      out_file: './logs/admin-out.log',
      merge_logs: true,
      time: true,
    },
    {
      name: 'restaurant-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: './apps/web',
      instances: 1,
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/web-error.log',
      out_file: './logs/web-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
