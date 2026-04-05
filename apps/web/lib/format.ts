import { format } from "date-fns";

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export const formatDate = (value: string | null): string => {
  if (!value) {
    return "Not scheduled";
  }
  return format(new Date(value), "MMM d, yyyy");
};

export const formatDateTime = (value: string): string => format(new Date(value), "MMM d, yyyy, h:mm a");
