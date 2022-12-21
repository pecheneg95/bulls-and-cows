import { DataSource, DataSourceOptions } from 'typeorm';

export async function connectToDatabase(options: DataSourceOptions): Promise<DataSource> {
  const AppDataSource = new DataSource(options);

  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((error) => {
      console.error('Error during Data Source initialization', error);
    });

  console.log('Connection to DB');

  return AppDataSource;
}
