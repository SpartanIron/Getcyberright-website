/**
 * Logs process memory every 15 minutes so leaks show up in Railway logs as a
 * trend (rss/heap climbing between deploys) instead of only on the bill.
 * Set MEMORY_LOG_INTERVAL_MINUTES=0 to disable.
 */
const minutes = Number(process.env.MEMORY_LOG_INTERVAL_MINUTES ?? 15);

if (Number.isFinite(minutes) && minutes > 0) {
  const mb = (n: number) => Math.round(n / 1048576);
  const startedAt = Date.now();
  setInterval(() => {
    const m = process.memoryUsage();
    const uptimeH = ((Date.now() - startedAt) / 3_600_000).toFixed(1);
    console.log(
      `[Memory] uptime=${uptimeH}h rss=${mb(m.rss)}MB heapUsed=${mb(m.heapUsed)}MB ` +
      `heapTotal=${mb(m.heapTotal)}MB external=${mb(m.external)}MB arrayBuffers=${mb(m.arrayBuffers)}MB`,
    );
  }, minutes * 60_000).unref();
}

export {};
