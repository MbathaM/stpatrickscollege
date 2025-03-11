import { auth } from "@/utils/auth";
import { RedisClientType } from "redis";

export type Session = typeof auth.$Infer.Session.session | null;
export type User = typeof auth.$Infer.Session.user | null;

export interface ContextVariables {
    user: User;
    session: Session;
    redis: RedisClientType;
};

export type AzureUserResponse = {
  "@odata.context": string;
  value: AzureUser[];
};

export type AzureUser = {
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string | null;
  mail: string;
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  surname: string;
  userPrincipalName: string;
  id: string;
};

export interface GeoData {
  ip: string
  continent_name: string
  country_name: string
  country_capital: string
  state_prov: string
  city: string
  latitude: string
  longitude: string
}

export interface WeatherData {
  main?: {
    temp: number;
    humidity: number;
  };
  wind?: {
    speed: number;
  };
  weather?: {
    main: string;
    description: string;
  }[];
  name?: string;
}

export interface TimezoneData {
  abbreviation: string;
  client_ip: string;
  datetime: string;
  day_of_week: number;
  day_of_year: number;
  dst: boolean;
  dst_from: string;
  dst_offset: number;
  dst_until: string;
  raw_offset: number;
  timezone: string;
  unixtime: number;
  utc_datetime: string;
  utc_offset: string;
  week_number: number;
}

export interface TimezoneResponse {
  data: TimezoneData;
}