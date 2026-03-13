import { set, connect } from 'mongoose';
import { ConnectionString } from 'connection-string';
import clc from 'cli-color';
import config from './config';

export default async function () {
  try {
    const uri = new ConnectionString('', {
      user: config.DB_USER_MONGO,
      password: config.DB_KEY_MONGO,
      protocol: 'mongodb+srv',
      hosts: [{ name: config.DB_HOST_MONGO }],
      path: [String(config.DB_COLLECTION_NAME_MONGO)],
      params: {
        appName:config.DB_CONTAINER_NAME_MONGO,
        retryWrites: true,
        w: 'majority',
      },
    });

    const optionMongoose = {};

    set('runValidators', true);

    await connect(uri.toString(), optionMongoose);

    console.log(clc.blue('The database is connected'));
  } catch (error) {
    console.error(clc.red(error));
  }
}
