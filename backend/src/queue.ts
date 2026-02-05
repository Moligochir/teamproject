import { Queue } from "bullmq";
import { connection } from "./redis";

export const jobQueue = new Queue("jobs", {
  connection: connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
