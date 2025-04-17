import winston from 'winston';

/**
 * Sistema de logs para a aplicação utilizando Winston
 * Registra informações, alertas e erros para monitoramento da aplicação
 */

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Em ambiente de produção, pode adicionar outras transports como arquivos
    // ou serviços de log externos
  ],
});

// Em ambiente de desenvolvimento, formato mais legível
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

export { logger }; 