export type ApiEnvelope<T> = {
  data: T;
};

export type EntityId = string;

export type HealthStatus = {
  status: "ok";
  service: string;
  timestamp: string;
};
