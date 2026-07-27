"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
  Flag,
  Link2,
  Network,
  Plus,
  Target,
  X,
} from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  GoalArea,
  GoalPriority,
  GoalStatus,
} from "@/generated/prisma";
import {
  assignGoalToMasterAction,
  createGoalAction,
  moveGoalAction,
} from "@/server/actions/goals";

export type GoalMapItem = {
  id: string;
  parentGoalId: string | null;
  title: string;
  description: string | null;
  area: GoalArea;
  status: GoalStatus;
  priority: GoalPriority;
  targetDate: string | null;
  progress: number;
  isMaster: boolean;
  mapX: number;
  mapY: number;
};

type GoalNodeData = {
  goal: GoalMapItem;
  childCount: number;
};

const AREA_LABELS: Record<GoalArea, string> = {
  BUSINESS: "Business",
  PERSONAL: "Personal",
  HEALTH: "Health",
  LEARNING: "Learning",
  FINANCE: "Finance",
  RELATIONSHIPS: "Relationships",
  SPIRITUAL: "Spiritual",
};

const PRIORITY_LABELS: Record<GoalPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

function MasterGoalNode({ data }: NodeProps<GoalNodeData>) {
  return (
    <article className="relative w-[250px] rounded-2xl border border-amber-200/55 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.82),rgba(255,255,255,0)_32%),linear-gradient(135deg,#fde68a_0%,#f59e0b_50%,#78350f_100%)] px-4 py-3 text-black shadow-[0_24px_65px_rgba(245,158,11,0.3)] transition hover:-translate-y-0.5 hover:brightness-110">
      <div className="mb-3 flex items-start justify-between gap-3">
        <Crown className="mt-0.5 h-5 w-5 shrink-0" />
        <span className="rounded-full border border-black/15 bg-black/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em]">
          Master goal
        </span>
      </div>
      <h3 className="min-h-10 text-sm font-black leading-5">
        {data.goal.title}
      </h3>
      <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
        <span>{data.goal.progress}% complete</span>
        <span>{data.childCount} goals</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border !border-black/25 !bg-black/75"
      />
    </article>
  );
}

function GoalNode({ data }: NodeProps<GoalNodeData>) {
  return (
    <article className="relative w-[220px] rounded-2xl border border-white/15 bg-[#111218]/95 px-4 py-3 text-white shadow-[0_18px_45px_rgba(0,0,0,0.38)] backdrop-blur transition hover:-translate-y-0.5 hover:border-white/25">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border !border-amber-200/40 !bg-amber-300"
      />
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
          {AREA_LABELS[data.goal.area]}
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[9px] font-semibold text-white/60">
          {data.goal.priority}
        </span>
      </div>
      <h3 className="min-h-10 text-sm font-semibold leading-5">
        {data.goal.title}
      </h3>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-amber-300"
          style={{ width: `${Math.min(100, Math.max(0, data.goal.progress))}%` }}
        />
      </div>
      <p className="mt-2 text-[10px] text-white/45">
        {data.goal.progress}% complete
      </p>
    </article>
  );
}

const nodeTypes = {
  masterGoal: MasterGoalNode,
  goal: GoalNode,
};

function GoalRelationshipMap({
  goals,
  onRelationshipChanged,
}: {
  goals: GoalMapItem[];
  onRelationshipChanged: () => void;
}) {
  const childCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const goal of goals) {
      if (goal.parentGoalId) {
        counts.set(
          goal.parentGoalId,
          (counts.get(goal.parentGoalId) ?? 0) + 1,
        );
      }
    }

    return counts;
  }, [goals]);

  const mappedNodes = useMemo<Node<GoalNodeData>[]>(
    () =>
      goals.map((goal) => ({
        id: goal.id,
        type: goal.isMaster ? "masterGoal" : "goal",
        position: {
          x: goal.mapX,
          y: goal.mapY,
        },
        data: {
          goal,
          childCount: childCounts.get(goal.id) ?? 0,
        },
      })),
    [childCounts, goals],
  );

  const mappedEdges = useMemo<Edge[]>(
    () =>
      goals
        .filter((goal) => !goal.isMaster && goal.parentGoalId)
        .map((goal) => ({
          id: `goal-parent:${goal.id}`,
          source: goal.parentGoalId!,
          target: goal.id,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 18,
            height: 18,
            color: "rgba(251,191,36,0.9)",
          },
          style: {
            stroke: "rgba(251,191,36,0.78)",
            strokeWidth: 2,
            strokeDasharray: "7 5",
          },
        })),
    [goals],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(mappedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(mappedEdges);

  useEffect(() => {
    setNodes(mappedNodes);
  }, [mappedNodes, setNodes]);

  useEffect(() => {
    setEdges(mappedEdges);
  }, [mappedEdges, setEdges]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) {
        return;
      }

      const source = goals.find((goal) => goal.id === connection.source);
      const target = goals.find((goal) => goal.id === connection.target);

      if (!source?.isMaster || !target || target.isMaster) {
        return;
      }

      void assignGoalToMasterAction({
        goalId: target.id,
        masterGoalId: source.id,
      }).then(onRelationshipChanged);
    },
    [goals, onRelationshipChanged],
  );

  const handleEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      const goalId = edge.id.split(":")[1];

      if (!goalId) {
        return;
      }

      void assignGoalToMasterAction({
        goalId,
        masterGoalId: null,
      }).then(onRelationshipChanged);
    },
    [onRelationshipChanged],
  );

  return (
    <div className="relative h-full min-h-[560px] overflow-hidden rounded-2xl border border-white/10 bg-black/35">
      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-sm rounded-xl border border-white/10 bg-black/65 px-3 py-2 text-[11px] leading-5 text-white/60 backdrop-blur">
        Gold boxes are master goals. Drag from a gold handle to a regular goal
        to connect them. Click a connection to remove it.
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onEdgeClick={handleEdgeClick}
        onNodeDragStop={(_event, node) => {
          void moveGoalAction({
            goalId: node.id,
            mapX: node.position.x,
            mapY: node.position.y,
          });
        }}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.3}
        maxZoom={2.25}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={22} size={1} color="rgba(255,255,255,0.065)" />
        <MiniMap
          nodeColor={(node) =>
            node.type === "masterGoal"
              ? "rgba(245,158,11,0.96)"
              : "rgba(255,255,255,0.62)"
          }
          maskColor="rgba(0,0,0,0.72)"
          style={{
            width: 130,
            height: 84,
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
          }}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "No target date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function GoalCard({
  goal,
  parentTitle,
}: {
  goal: GoalMapItem;
  parentTitle: string | null;
}) {
  return (
    <article
      className={
        goal.isMaster
          ? "rounded-2xl border border-amber-300/30 bg-[linear-gradient(135deg,rgba(245,158,11,0.2),rgba(120,53,15,0.12))] p-5 shadow-[0_18px_55px_rgba(245,158,11,0.09)]"
          : "rounded-2xl border border-white/10 bg-white/[0.035] p-5"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {goal.isMaster ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/30 bg-amber-300/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100">
                <Crown className="h-3 w-3" />
                Master goal
              </span>
            ) : (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                {AREA_LABELS[goal.area]}
              </span>
            )}
            <span className="text-xs text-white/35">
              {PRIORITY_LABELS[goal.priority]} priority
            </span>
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">
            {goal.title}
          </h3>
          {goal.description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
              {goal.description}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 text-sm font-semibold text-white/65">
          {goal.progress}%
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={
            goal.isMaster
              ? "h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-200"
              : "h-full rounded-full bg-white/65"
          }
          style={{ width: `${Math.min(100, Math.max(0, goal.progress))}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/40">
        <span>{formatDate(goal.targetDate)}</span>
        {!goal.isMaster ? (
          <span>{parentTitle ? `Master: ${parentTitle}` : "Unassigned"}</span>
        ) : null}
      </div>
    </article>
  );
}

function AddGoalModal({
  open,
  masterGoals,
  onClose,
}: {
  open: boolean;
  masterGoals: GoalMapItem[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [isMaster, setIsMaster] = useState(false);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target && !isPending) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-goal-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0a0a0e] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.75)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200/60">
              Command Center
            </p>
            <h2
              id="add-goal-title"
              className="mt-2 text-2xl font-semibold tracking-tight"
            >
              Add goal
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close add goal"
            className="rounded-xl border border-white/10 p-2 text-white/55 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="mt-6 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            const form = new FormData(event.currentTarget);

            startTransition(async () => {
              try {
                await createGoalAction({
                  title: String(form.get("title") ?? ""),
                  description: String(form.get("description") ?? ""),
                  area: String(form.get("area") ?? "BUSINESS") as GoalArea,
                  priority: String(
                    form.get("priority") ?? "MEDIUM",
                  ) as GoalPriority,
                  targetDate: String(form.get("targetDate") ?? ""),
                  isMaster,
                  parentGoalId: isMaster
                    ? undefined
                    : String(form.get("parentGoalId") ?? "") || undefined,
                });
                router.refresh();
                onClose();
              } catch (caught) {
                setError(
                  caught instanceof Error
                    ? caught.message
                    : "The goal could not be created",
                );
              }
            });
          }}
        >
          <label className="grid gap-2 text-sm text-white/65">
            Goal title
            <input
              name="title"
              required
              maxLength={140}
              autoFocus
              placeholder="Build a predictable client acquisition system"
              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-amber-200/35"
            />
          </label>

          <label className="grid gap-2 text-sm text-white/65">
            Description
            <textarea
              name="description"
              rows={3}
              placeholder="Define the outcome and why it matters."
              className="resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-amber-200/35"
            />
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4">
            <input
              type="checkbox"
              checked={isMaster}
              onChange={(event) => setIsMaster(event.target.checked)}
              className="mt-1 h-4 w-4 accent-amber-400"
            />
            <span>
              <span className="flex items-center gap-2 font-semibold text-amber-100">
                <Crown className="h-4 w-4" />
                Make this a master goal
              </span>
              <span className="mt-1 block text-xs leading-5 text-white/45">
                Master goals become gold boxes and organize several supporting
                goals beneath one major outcome.
              </span>
            </span>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/65">
              Area
              <select
                name="area"
                defaultValue="BUSINESS"
                className="rounded-xl border border-white/10 bg-[#121218] px-4 py-3 text-white outline-none focus:border-amber-200/35"
              >
                {Object.entries(AREA_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-white/65">
              Priority
              <select
                name="priority"
                defaultValue="MEDIUM"
                className="rounded-xl border border-white/10 bg-[#121218] px-4 py-3 text-white outline-none focus:border-amber-200/35"
              >
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-white/65">
              Target date
              <input
                type="date"
                name="targetDate"
                className="rounded-xl border border-white/10 bg-[#121218] px-4 py-3 text-white outline-none focus:border-amber-200/35"
              />
            </label>

            {!isMaster ? (
              <label className="grid gap-2 text-sm text-white/65">
                Master goal
                <select
                  name="parentGoalId"
                  defaultValue=""
                  className="rounded-xl border border-white/10 bg-[#121218] px-4 py-3 text-white outline-none focus:border-amber-200/35"
                >
                  <option value="">Unassigned</option>
                  {masterGoals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs leading-5 text-white/40">
                This master goal will sit at the top level of the relationship
                map.
              </div>
            )}
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
            >
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/[0.06] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-100/40 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 px-4 py-2.5 text-sm font-bold text-black shadow-[0_12px_35px_rgba(245,158,11,0.25)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {isPending ? "Adding…" : "Add goal"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function GoalWorkspace({
  initialGoals,
}: {
  initialGoals: GoalMapItem[];
}) {
  const router = useRouter();
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const masterGoals = initialGoals.filter((goal) => goal.isMaster);
  const regularGoals = initialGoals.filter((goal) => !goal.isMaster);
  const titleById = new Map(
    initialGoals.map((goal) => [goal.id, goal.title] as const),
  );

  return (
    <section className="px-5 py-8 lg:px-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
            Owner Only
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Goals
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
            Turn major outcomes into a visible operating system. Master goals
            define direction; connected goals turn that direction into
            measurable progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddGoalOpen(true)}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-amber-100/40 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 px-4 py-3 text-sm font-bold text-black shadow-[0_14px_40px_rgba(245,158,11,0.24)] transition hover:-translate-y-0.5 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Add goal
        </button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.055] p-4">
          <Crown className="h-5 w-5 text-amber-200" />
          <p className="mt-3 text-2xl font-semibold">{masterGoals.length}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
            Master goals
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <Target className="h-5 w-5 text-white/65" />
          <p className="mt-3 text-2xl font-semibold">{regularGoals.length}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
            Supporting goals
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <Link2 className="h-5 w-5 text-white/65" />
          <p className="mt-3 text-2xl font-semibold">
            {regularGoals.filter((goal) => goal.parentGoalId).length}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
            Connected
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-3xl border border-white/10 bg-[#09090d] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              <Network className="h-4 w-4" />
              Relationship map
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              Outcomes and supporting goals
            </h2>
          </div>
          <p className="text-xs text-white/35">
            Drag to organize · positions save automatically
          </p>
        </div>

        {initialGoals.length ? (
          <GoalRelationshipMap
            goals={initialGoals}
            onRelationshipChanged={() => router.refresh()}
          />
        ) : (
          <div className="grid min-h-[460px] place-items-center rounded-2xl border border-dashed border-white/15 bg-black/30 px-6 text-center">
            <div className="max-w-md">
              <Flag className="mx-auto h-8 w-8 text-amber-200/70" />
              <h2 className="mt-4 text-xl font-semibold">
                Start with a master goal
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/45">
                Create the major outcome first, then add the supporting goals
                that move it forward.
              </p>
              <button
                type="button"
                onClick={() => setAddGoalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-amber-200/30 bg-amber-300/10 px-4 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/15"
              >
                <Plus className="h-4 w-4" />
                Add first goal
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Goal register
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Goals beneath the map
            </h2>
          </div>
          <span className="text-sm text-white/35">
            {initialGoals.length} total
          </span>
        </div>

        {initialGoals.length ? (
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {[...masterGoals, ...regularGoals].map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                parentTitle={
                  goal.parentGoalId
                    ? (titleById.get(goal.parentGoalId) ?? null)
                    : null
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center text-sm text-white/35">
            Your goals will appear here after you add the first one.
          </div>
        )}
      </section>

      <AddGoalModal
        open={addGoalOpen}
        masterGoals={masterGoals}
        onClose={() => setAddGoalOpen(false)}
      />
    </section>
  );
}
