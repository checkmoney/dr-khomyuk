const { Client } = require('pg');
const { readFileSync } = require('fs');
const { join, resolve } = require('path');
const { CommonConfiguration } = require('@solid-soda/config');

const config = new CommonConfiguration(resolve(__dirname, './.env'));

const getSslConfig =
  process.env.NODE_ENV !== 'production'
    ? () => undefined
    : () => ({
        ca: readFileSync(
          join(__dirname, '..', '.secure', 'ca-certificate.txt'),
        ),
      });

const client = new Client({
  user: config.getStringOrThrow('DB_USER'),
  database: config.getStringOrThrow('DB_NAME'),
  password: config.getStringOrThrow('DB_PASSWORD'),
  port: config.getStringOrThrow('DB_PORT'),
  host: config.getStringOrThrow('DB_HOST'),
  ssl: getSslConfig(),
});

client.connect().then(() => {
  console.log(`Connected to ${process.env.DB_NAME}`);
});

module.exports = {
  evolutionsFolderPath: ['evolutions'],
  runQuery(query) {
    return client.query(query).then((result) => result.rows);
  },
};
