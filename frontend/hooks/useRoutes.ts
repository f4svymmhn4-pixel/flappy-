'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useApiToken } from './useApiToken';
import type { Bike, DeepLink, GenerateRoutePayload, RouteRecord } from '@/lib/types';

export function useBikes() {
  const token = useApiToken();
  return useQuery({
    queryKey: ['bikes', token],
    queryFn: () => apiFetch<Bike[]>('/bikes', token),
    enabled: Boolean(token),
  });
}

export function useGenerateRoute() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GenerateRoutePayload) =>
      apiFetch<RouteRecord>('/routes/generate', token, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}

export function useRouteHistory(favoritesOnly = false) {
  const token = useApiToken();
  return useQuery({
    queryKey: ['routes', favoritesOnly, token],
    queryFn: () =>
      apiFetch<RouteRecord[]>(`/routes${favoritesOnly ? '?favorites=true' : ''}`, token),
    enabled: Boolean(token),
  });
}

export function useRoute(id: string) {
  const token = useApiToken();
  return useQuery({
    queryKey: ['route', id, token],
    queryFn: () => apiFetch<RouteRecord>(`/routes/${id}`, token),
    enabled: Boolean(token) && Boolean(id),
  });
}

export function useDeepLinks(id: string) {
  const token = useApiToken();
  return useQuery({
    queryKey: ['deeplinks', id, token],
    queryFn: () => apiFetch<DeepLink[]>(`/routes/${id}/deeplinks`, token),
    enabled: Boolean(token) && Boolean(id),
  });
}

export function useToggleFavorite() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<RouteRecord>(`/routes/${id}/favorite`, token, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['route'] });
    },
  });
}

export function useDeleteRoute() {
  const token = useApiToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<{ success: boolean }>(`/routes/${id}`, token, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
