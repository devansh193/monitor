import { addMonitorJob, removeMonitorJob, updateMonitorJob } from '../utils/helper';
import { Client } from 'pg';
import path from 'path';
import Bree from 'bree';

export const bree = new Bree({
  root: path.join(__dirname, 'jobs'),
  defaultExtension: 'ts',
  acceptedExtensions: ['ts', 'js'],
  jobs: [{ name: 'monitor-task' }],
});

async function startScheduler() {
  await bree.start();
  const pgClient = new Client({ connectionString: process.env.DATABASE_URL });
  await pgClient.connect().then(() => {
    console.log('Connected to Postgres');
  });
  await pgClient.query('LISTEN website_inserts').then(() => {
    console.log('Listening to website_inserts');
  });
  await pgClient.query('LISTEN website_deletes');
  await pgClient.query('LISTEN website_updates');

  pgClient.on('notification', async (msg) => {
    console.log('Received notification:', msg.channel, msg.payload);
    const monitorId = msg.payload;
    if (msg.channel === 'website_inserts') {
      await addMonitorJob(monitorId!);
    } else if (msg.channel === 'website_delete') {
      await removeMonitorJob(monitorId!);
    } else if (msg.channel === 'website_updates') {
      console.log('Updating job for monitor:', monitorId);
      await updateMonitorJob(monitorId!);
    }
  });
}

startScheduler();
