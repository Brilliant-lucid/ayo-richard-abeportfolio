const listeners = new Set<() => void>();

export function openContactDialog() {
  listeners.forEach((l) => l());
}

export function subscribeContactDialog(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}