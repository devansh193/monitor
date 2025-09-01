import { workerData } from 'worker_threads';

(async () => {
  const { monitorId } = workerData;
  console.log(`Running monitor job for website: ${monitorId}`);
})();
