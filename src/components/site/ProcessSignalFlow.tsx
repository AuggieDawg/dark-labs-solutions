type ProcessStep = {
  number: string;
  title: string;
  body: string;
};

type ProcessSignalFlowProps = {
  steps: readonly ProcessStep[];
};

export function ProcessSignalFlow({ steps }: ProcessSignalFlowProps) {
  return (
    <div className="process-signal-flow mt-14">
      <div aria-hidden="true" className="process-signal-rail">
        <span className="process-signal-pulse" />
      </div>

      <ol className="process-signal-list">
        {steps.map((step) => (
          <li key={step.number} className="process-signal-step">
            <span aria-hidden="true" className="process-signal-node" />
            <p className="font-mono text-sm tracking-[0.18em] text-white/52">
              {step.number}
            </p>
            <h3 className="mt-10 text-2xl font-semibold tracking-[-0.04em]">
              {step.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/52">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
