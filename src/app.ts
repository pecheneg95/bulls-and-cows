import { DataSource } from 'typeorm';

import { connectToDatabase } from '@utils';
import { config } from '@config';
import sockets from './sockets';
import expressApp from './expressApp';

let dbConnection: DataSource;

async function init(): Promise<void> {
  try {
    dbConnection = await connectToDatabase(config.DEV.DB);

    sockets.listen(config.DEV.SOCKETS_PORT);
    console.log(`Websockets started on ${config.DEV.SOCKETS_PORT} port`);

    expressApp.listen(config.DEV.PORT, () => console.log(`Server started on ${config.DEV.PORT} port`));
  } catch (error) {
    console.log(error);
    dbConnection.destroy();
    process.exit(1);
  }
}

init();
