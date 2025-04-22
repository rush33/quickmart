import { FirebaseTimestamp } from "@/types/FirebaseTimestamp";
import { FieldValue } from "firebase/firestore";

export const formatFirebaseTimestamp = (
  timestamp?: FirebaseTimestamp | Date | FieldValue | null,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }
): string => {
  if (!timestamp) return "Invalid Date";

  if (isFieldValue(timestamp)) {
    return "Pending...";
  }

  if (timestamp instanceof Date) {
    return timestamp.toLocaleString(undefined, options);
  }

  if (isFirebaseTimestamp(timestamp)) {
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
    return new Date(milliseconds).toLocaleString(undefined, options);
  }

  return "Invalid Date";
};

function isFirebaseTimestamp(obj: any): obj is FirebaseTimestamp {
  return (
    obj &&
    typeof obj.seconds === "number" &&
    typeof obj.nanoseconds === "number"
  );
}

function isFieldValue(obj: any): obj is FieldValue {
  return obj && typeof obj === "object" && "_methodName" in obj;
}
