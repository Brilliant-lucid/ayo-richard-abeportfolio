type Listener = (serviceId?: string) => void;

const listeners = new Set<Listener>();

/** Open the contact experience. Pass a service id to jump straight to that service's form. */
export function openContactDialog(serviceId?: string) {
  listeners.forEach((l) => l(serviceId));
}

export function subscribeContactDialog(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
