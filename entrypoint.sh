yarn
npx sequelize db:migrate --url "postgres://$DATABASE_USER:$DATABASE_PASSWORD@$DATABASE_HOST:$DATABASE_PORT/$DATABASE"
yarn start
