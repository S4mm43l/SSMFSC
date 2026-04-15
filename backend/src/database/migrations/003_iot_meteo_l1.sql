create table if not exists iot.l1_meteo_data (
  created_at timestamptz not null,
  date_key int4 not null,
  node text not null,
  temperature_c float8,
  humidity_pct float8,
  pressure_hpa float8,
  rain_mm_h float8,
  wind_speed_ms float8,
  dust_conc float8,
  rssi_dbm float8,
  inserted_at timestamptz not null default now(),
  constraint l1_meteo_data_pkey primary key (created_at, node)
);

create table if not exists iot.etl_state (
  etl_name text primary key,
  last_ts timestamptz
);

create index if not exists idx_l1_meteo_data_created_at
  on iot.l1_meteo_data(created_at);

create index if not exists idx_l1_meteo_data_node
  on iot.l1_meteo_data(node);