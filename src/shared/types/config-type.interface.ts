export interface JwtConfig {
  secret: string | undefined;
  expiresIn: string | undefined;
}

export interface ConfigType {
  port: number;
  nodeEnv: string | undefined;
  baseUrl: string | undefined;
  op_format: string;
  ranking_url: string;
  jwt: JwtConfig;
}
