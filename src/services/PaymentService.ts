class PaymentService {
  static async pay(jobId: string) {
    const userId = localStorage.getItem("userId");

    const response = await fetch("/payment/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId, userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Payment failed");
    }

    return response.json();
  }
}

export default PaymentService;
