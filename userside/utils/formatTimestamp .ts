export const formatTimestamp = (timestamp?: Date | string): string => {
  if (!timestamp) return "Date not available";
  const date = new Date(timestamp);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
