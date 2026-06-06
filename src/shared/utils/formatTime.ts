import { formatDistanceToNow } from "date-fns"

export const formatTime = (date: Date | string): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}