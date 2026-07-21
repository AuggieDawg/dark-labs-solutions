"use client";

import { useId, useState } from "react";

type ClientAssignmentOption = {
  id: string;
  name: string;
  services: Array<{
    id: string;
    type: string;
    status: string;
  }>;
};

type ClientProjectAssignmentFieldsProps = {
  clients: ClientAssignmentOption[];
  initialClientId?: string;
  initialClientServiceId?: string;
};

const controlClass =
  "h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none transition focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50";

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function ClientProjectAssignmentFields({
  clients,
  initialClientId = "",
  initialClientServiceId = "",
}: ClientProjectAssignmentFieldsProps) {
  const id = useId();
  const validInitialClientId = clients.some(
    (client) => client.id === initialClientId,
  )
    ? initialClientId
    : "";
  const initialClient = clients.find(
    (client) => client.id === validInitialClientId,
  );
  const validInitialServiceId = initialClient?.services.some(
    (service) => service.id === initialClientServiceId,
  )
    ? initialClientServiceId
    : "";

  const [clientId, setClientId] = useState(validInitialClientId);
  const [clientServiceId, setClientServiceId] = useState(validInitialServiceId);
  const selectedClient = clients.find((client) => client.id === clientId);
  const services = selectedClient?.services ?? [];

  return (
    <>
      <label className="grid gap-2" htmlFor={`${id}-client`}>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          Client business
        </span>
        <select
          id={`${id}-client`}
          name="clientId"
          value={clientId}
          onChange={(event) => {
            setClientId(event.target.value);
            setClientServiceId("");
          }}
          className={controlClass}
        >
          <option value="">Internal / no client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2" htmlFor={`${id}-service`}>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          Service workstream
        </span>
        <select
          id={`${id}-service`}
          name="clientServiceId"
          value={clientServiceId}
          onChange={(event) => setClientServiceId(event.target.value)}
          disabled={!clientId || services.length === 0}
          aria-describedby={`${id}-service-help`}
          className={controlClass}
        >
          <option value="">No workstream</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {formatEnum(service.type)} — {formatEnum(service.status)}
            </option>
          ))}
        </select>
        <span
          id={`${id}-service-help`}
          className="text-xs leading-5 text-white/50"
        >
          {!clientId
            ? "Choose a client business to see its configured workstreams."
            : services.length === 0
              ? "This business has no configured workstreams yet."
              : "Optional. Only workstreams for the selected business are shown."}
        </span>
      </label>
    </>
  );
}
