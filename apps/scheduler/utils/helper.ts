import { websites } from '@repo/store/schema';
import db from '@repo/store/client';
import { eq } from 'drizzle-orm';
import { bree } from '../src';
import path from 'path';

export async function addMonitorJob(monitorId: string) {
  const [monitor] = await db.select().from(websites).where(eq(websites.id, monitorId));
  if (!monitor) {
    console.error(`Monitor with ID ${monitorId} not found.`);
    return;
  }
  const jobName = `monitor-${monitorId}`;
  if (bree.config.jobs.find((job) => job.name === jobName)) {
    console.log(`Job for monitor ${monitorId} already exists.`);
    return;
  }
  bree.add({
    name: jobName,
    path: path.join(__dirname, 'jobs', 'monitor-task.ts'),
    interval: `${monitor.monitoringIntervalSeconds}`,
    worker: {
      workerData: { monitor },
    },
  });
  await bree.start(jobName);
  console.log(`Added and started job for monitor ${monitorId}`);
}

export async function updateMonitorJob(monitorId: string) {
  await bree.stop(`monitor-${monitorId}`);
  bree.remove(`monitor-${monitorId}`);
  await addMonitorJob(monitorId);
  console.log(`Updated job for monitor ${monitorId}`);
}

export async function removeMonitorJob(monitorId: string) {
  await bree.stop(`monitor-${monitorId}`);
  bree.remove(`monitor-${monitorId}`);
  console.log(`Removed job for monitor ${monitorId}`);
}
