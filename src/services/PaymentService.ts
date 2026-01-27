export interface PaymentResult {
  jobId: string;
  status: string;
  queuePosition: number;
  fileName?: string;
  colorMode?: string;
}

export const PaymentService = {
  pay: async (jobId: string): Promise<PaymentResult> => {
    const res = await fetch('/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jobId })
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Payment failed: ${msg}`);
    }

    const job = await res.json();

    return {
      jobId: job.id || job.jobId,
      status: job.status,
      queuePosition: job.queuePosition,
      fileName: job.fileName,
      colorMode: job.colorMode
    };
  }
};
