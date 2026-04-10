// Why does this exist??



import { useEffect, useState } from "react";

type GlobalJob = {
  jobId: string;
  userId: string;
  fileName: string;
  pageRanges: number[];
  colorMode: string;
  status: string;
  createdAt: number;
};

const GlobalQueuePage = () => {
  const [globalQueue, setGlobalQueue] = useState<GlobalJob[]>([]);

  useEffect(() => {
    fetch("/api/queue/global")
      .then(res => res.json())
      .then(data => setGlobalQueue(data))
      .catch(err => console.error("Failed to fetch global queue:", err));
  }, []);

  return (
    <div>
      <h2>Global Queue</h2>
      <ul>
        {globalQueue.map(job => (
          <li key={job.jobId}>
            {job.userId} → {job.fileName} ({job.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GlobalQueuePage;
