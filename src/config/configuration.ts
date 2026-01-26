import { ConfigType } from 'src/shared/types/config-type.interface';

/**
 * Helper function to get required environment variable
 * @param key - Environment variable key
 * @param customMessage - Optional custom error message
 * @returns The environment variable value
 * @throws Error if the environment variable is undefined
 */
const getRequiredEnvVar = (key: string, customMessage?: string): string => {
  const value = process.env[key];
  if (value === undefined || value?.trim() === '') {
    throw new Error(
      customMessage ?? `${key} is not defined in environment variables`,
    );
  }

  return value;
};

export default (): ConfigType => {
  const port = getRequiredEnvVar('PORT', 'PORT must be defined');
  const nodeEnv = getRequiredEnvVar('NODE_ENV', 'NODE_ENV must be defined');
  const baseUrl = getRequiredEnvVar('BASE_URL', 'BASE_URL must be defined');
  const jwtSecret = getRequiredEnvVar(
    'JWT_SECRET',
    'JWT_SECRET must be defined',
  );
  const jwtExpiresIn = getRequiredEnvVar(
    'JWT_EXPIRES_IN',
    'JWT_EXPIRES_IN must be defined',
  );
  const OP_FORMAT = getRequiredEnvVar('OP_FORMAT', 'OP_FORMAT must be defined');
  const rankingUrl = getRequiredEnvVar(
    'RANKING_URL',
    'RANKING_URL must be defined',
  );
  return {
    port: Number.parseInt(port, 10),
    nodeEnv,
    baseUrl,
    jwt: {
      secret: jwtSecret,
      expiresIn: jwtExpiresIn,
    },
    op_format: OP_FORMAT,
    ranking_url: rankingUrl,
  };
};
