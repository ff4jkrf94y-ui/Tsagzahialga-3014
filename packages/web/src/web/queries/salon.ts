import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";
export const useServices = () => useQuery(orpc.salon.services.queryOptions());
export const useSlots = (date: string, service: number) =>
  useQuery(
    orpc.salon.slots.queryOptions({
      input: { date, service },
      enabled: !!date,
    }),
  );
export const useBook = () => useMutation(orpc.salon.book.mutationOptions());
export const useBookings = () =>
  useQuery(
    orpc.salon.list.queryOptions({
      retry: false,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
    }),
  );
export const useStatus = () => {
  const q = useQueryClient();
  return useMutation(
    orpc.salon.status.mutationOptions({
      onSuccess: () => q.invalidateQueries({ queryKey: orpc.salon.list.key() }),
    }),
  );
};

export const useSettings = () =>
  useQuery(orpc.salonSettings.get.queryOptions());
export const useSaveSettings = () => {
  const q = useQueryClient();
  return useMutation(
    orpc.salonSettings.save.mutationOptions({
      onSuccess: () => {
        q.invalidateQueries({ queryKey: orpc.salonSettings.get.key() });
        q.invalidateQueries({ queryKey: orpc.salon.slots.key() });
      },
    }),
  );
};

export const useSavePrices = () => {
  const q = useQueryClient();
  return useMutation(
    orpc.salon.savePrices.mutationOptions({
      onSuccess: () =>
        q.invalidateQueries({ queryKey: orpc.salon.services.key() }),
    }),
  );
};
