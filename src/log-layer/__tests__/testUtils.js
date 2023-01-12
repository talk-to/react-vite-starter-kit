export const getLastLog = async (logStore, count = 1) => {
  const allLogs = await logStore.getAll();
  if (count === 1) {
    return allLogs.length ? allLogs[allLogs.length - 1] : undefined;
  }
  if (!allLogs.length) return [];
  return allLogs.slice(Math.max(0, allLogs.length - count));
};
