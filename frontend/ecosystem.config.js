module.exports = {
  apps: [
    {
      name: 'faixarosa-frontend',  // Nome do processo
      script: 'npm',               // Usando npm para rodar o Next.js
      args: 'start',               // O comando que deve ser executado
      env: {
        PORT: 3000,                // Definindo a porta como 3000
      },
      env_production: {
        NODE_ENV: 'production',   // Definindo o ambiente como produção
        PORT: 3000,
      },
    },
  ],
};
