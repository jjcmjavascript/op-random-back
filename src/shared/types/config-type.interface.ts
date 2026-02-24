export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface ConfigType {
  port: number;
  nodeEnv: string | undefined;
  baseUrl: string | undefined;
  op_format: string;
  ranking_url: string;
  ranking_url_to_find: string;
  jwt: JwtConfig;
}
