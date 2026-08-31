import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Check, ChevronRight, RotateCcw, Plus, Trash2, Pencil, X } from "lucide-react";
import "./styles.css";

type Task = { id: string; title: string; children?: Task[] };
type Target = { id: string; title: string; subtitle: string; side: "left" | "right"; tasks: Task[] };
type Month = { id: string; label: string; year: string; targets: Target[] };

const defaultMonths: Month[] = [
  {
    id: "aug-2026",
    label: "AUGUST",
    year: "2026–2027",
    targets: [
      {
        id: "aug-academics",
        title: "Academics",
        subtitle: "Build a strong sophomore-year system",
        side: "left",
        tasks: [
          {
            id: "aug-acad-plan",
            title: "Verify pre-med prerequisites",
            children: [
              { id: "aug-acad-1", title: "List completed prerequisites" },
              { id: "aug-acad-2", title: "Identify remaining biology + lab requirements" },
              { id: "aug-acad-3", title: "Identify remaining chemistry + lab requirements" },
              { id: "aug-acad-4", title: "Check physics, statistics, and writing requirements" },
            ],
          },
          {
            id: "aug-acad-system",
            title: "Create academic system",
            children: [
              { id: "aug-acad-5", title: "Add exams and deadlines to calendar" },
              { id: "aug-acad-6", title: "Set recurring weekly study blocks" },
              { id: "aug-acad-7", title: "Save office hours and tutoring resources" },
            ],
          },
        ],
      },
      {
        id: "aug-research",
        title: "Research",
        subtitle: "Establish a long-term research direction",
        side: "right",
        tasks: [
          {
            id: "aug-res-interest",
            title: "Determine research interests",
            children: [
              { id: "aug-res-1", title: "List 3–5 research areas of interest" },
              { id: "aug-res-2", title: "Rank your interests" },
              { id: "aug-res-3", title: "Choose skills you want to develop" },
            ],
          },
          {
            id: "aug-res-options",
            title: "Identify opportunities",
            children: [
              { id: "aug-res-4", title: "Search faculty and lab pages" },
              { id: "aug-res-5", title: "Create a shortlist of potential labs" },
              { id: "aug-res-6", title: "Read lab descriptions" },
            ],
          },
        ],
      },
      {
        id: "aug-clinical",
        title: "Clinical Experience",
        subtitle: "Find sustainable patient-facing exposure",
        side: "left",
        tasks: [
          {
            id: "aug-clinical-search",
            title: "Research opportunities",
            children: [
              { id: "aug-clin-1", title: "Find hospital or clinic opportunities" },
              { id: "aug-clin-2", title: "Compare volunteer and paid roles" },
              { id: "aug-clin-3", title: "Check eligibility and weekly commitment" },
            ],
          },
          {
            id: "aug-clinical-apply",
            title: "Prepare applications",
            children: [
              { id: "aug-clin-4", title: "Update résumé" },
              { id: "aug-clin-5", title: "Submit strongest applications" },
            ],
          },
        ],
      },
      {
        id: "aug-service",
        title: "Community Service",
        subtitle: "Choose one sustainable non-clinical commitment",
        side: "right",
        tasks: [
          {
            id: "aug-service-find",
            title: "Find a meaningful service role",
            children: [
              { id: "aug-serv-1", title: "Identify causes you care about" },
              { id: "aug-serv-2", title: "Find 3–5 organizations" },
              { id: "aug-serv-3", title: "Contact or apply to top choices" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sep-2026",
    label: "SEPTEMBER",
    year: "2026–2027",
    targets: [
      {
        id: "sep-academics",
        title: "Academics",
        subtitle: "Test and refine your study system",
        side: "left",
        tasks: [
          {
            id: "sep-acad-review",
            title: "Evaluate first month",
            children: [
              { id: "sep-acad-1", title: "Check whether weekly study blocks are realistic" },
              { id: "sep-acad-2", title: "Attend office hours in weaker courses" },
              { id: "sep-acad-3", title: "Adjust schedule before first major exams" },
            ],
          },
        ],
      },
      {
        id: "sep-research",
        title: "Research",
        subtitle: "Move from exploration to outreach",
        side: "right",
        tasks: [
          {
            id: "sep-res-prepare",
            title: "Prepare professor outreach",
            children: [
              { id: "sep-res-1", title: "Read one recent paper per shortlisted lab" },
              { id: "sep-res-2", title: "Write why each lab interests you" },
              { id: "sep-res-3", title: "Polish your CV" },
            ],
          },
          {
            id: "sep-res-contact",
            title: "Contact laboratories",
            children: [
              { id: "sep-res-4", title: "Send personalized outreach emails" },
              { id: "sep-res-5", title: "Track responses" },
              { id: "sep-res-6", title: "Prepare follow-ups after about one week" },
            ],
          },
        ],
      },
      {
        id: "sep-clinical",
        title: "Clinical Experience",
        subtitle: "Finish applications and onboarding",
        side: "left",
        tasks: [
          {
            id: "sep-clinical-onboarding",
            title: "Advance applications",
            children: [
              { id: "sep-clin-1", title: "Follow up on submitted applications" },
              { id: "sep-clin-2", title: "Complete onboarding requirements" },
              { id: "sep-clin-3", title: "Choose a sustainable weekly schedule" },
            ],
          },
        ],
      },
      {
        id: "sep-shadow",
        title: "Shadowing",
        subtitle: "Begin physician outreach",
        side: "right",
        tasks: [
          {
            id: "sep-shadow-outreach",
            title: "Contact physicians",
            children: [
              { id: "sep-shadow-1", title: "Choose 3–5 specialties of interest" },
              { id: "sep-shadow-2", title: "Create a physician contact list" },
              { id: "sep-shadow-3", title: "Send concise shadowing requests" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "oct-2026",
    label: "OCTOBER",
    year: "2026–2027",
    targets: [
      {
        id: "oct-academics",
        title: "Academics",
        subtitle: "Use first exam results to correct weaknesses",
        side: "left",
        tasks: [
          {
            id: "oct-acad-correct",
            title: "Review performance",
            children: [
              { id: "oct-acad-1", title: "Analyze first exam results" },
              { id: "oct-acad-2", title: "Identify the weakest course or topic" },
              { id: "oct-acad-3", title: "Increase support where needed" },
            ],
          },
        ],
      },
      {
        id: "oct-research",
        title: "Research",
        subtitle: "Secure a long-term position",
        side: "right",
        tasks: [
          {
            id: "oct-res-interviews",
            title: "Convert outreach into opportunities",
            children: [
              { id: "oct-res-1", title: "Follow up with non-responsive labs" },
              { id: "oct-res-2", title: "Attend interviews or lab meetings" },
              { id: "oct-res-3", title: "Compare mentorship and project fit" },
              { id: "oct-res-4", title: "Choose and join the strongest fit" },
            ],
          },
        ],
      },
      {
        id: "oct-clinical",
        title: "Clinical Experience",
        subtitle: "Begin recurring exposure",
        side: "left",
        tasks: [
          {
            id: "oct-clinical-start",
            title: "Start regular shifts",
            children: [
              { id: "oct-clin-1", title: "Complete training" },
              { id: "oct-clin-2", title: "Begin weekly shifts" },
              { id: "oct-clin-3", title: "Start a private reflection log" },
            ],
          },
        ],
      },
      {
        id: "oct-service",
        title: "Community Service",
        subtitle: "Begin sustained involvement",
        side: "right",
        tasks: [
          {
            id: "oct-service-start",
            title: "Establish routine",
            children: [
              { id: "oct-serv-1", title: "Begin recurring service" },
              { id: "oct-serv-2", title: "Set a sustainable monthly commitment" },
              { id: "oct-serv-3", title: "Record meaningful responsibilities" },
            ],
          },
        ],
      },
    ],
  },
];

const storageKey = "premed-timeline-completed-v1";
const roadmapStorageKey = "premed-timeline-roadmap-v1";

type EditorRequest =
  | { kind: "target"; monthId: string }
  | { kind: "subtarget"; monthId: string; targetId: string }
  | { kind: "leaf"; monthId: string; targetId: string; taskId: string }
  | { kind: "edit-target"; monthId: string; targetId: string }
  | { kind: "edit-subtarget"; monthId: string; targetId: string; taskId: string }
  | { kind: "edit-leaf"; monthId: string; targetId: string; taskId: string; leafId: string }
  | null;

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function leafIds(task: Task): string[] {
  if (task.children === undefined) return [task.id];
  if (task.children.length === 0) return [];
  return task.children.flatMap(leafIds);
}

const monthBackgrounds = [
  "#eef4f7", // August
  "#f4efe7", // September
  "#eef3eb", // October
  "#f3eef4", // November
  "#f2f1e9", // December
  "#eaf1f3", // January
  "#f5eee9", // February
  "#edf3ec", // March
  "#f1eef4", // April
  "#f4f1e8", // May
  "#eaf2ef", // June
  "#eef0f5", // July
];

function App() {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    const raw = localStorage.getItem(storageKey);
    return new Set(raw ? JSON.parse(raw) : []);
  });

  const [roadmap, setRoadmap] = useState<Month[]>(() => {
    const raw = localStorage.getItem(roadmapStorageKey);
    return raw ? JSON.parse(raw) : defaultMonths;
  });

  const undoHistory = useRef<Month[][]>([]);
  const roadmapRef = useRef<Month[]>(roadmap);

  useEffect(() => {
    roadmapRef.current = roadmap;
  }, [roadmap]);

  const commitRoadmapEdit = (updater: (current: Month[]) => Month[]) => {
    const current = roadmapRef.current;
    const next = updater(current);
    if (next === current) return;

    undoHistory.current.push(structuredClone(current));
    if (undoHistory.current.length > 50) undoHistory.current.shift();

    roadmapRef.current = next;
    setRoadmap(next);
  };

  const undoRoadmapEdit = () => {
    const previous = undoHistory.current.pop();
    if (!previous) return;
    roadmapRef.current = previous;
    setRoadmap(previous);
    setEditor(null);
  };

  useEffect(() => {
    const handleUndo = (event: KeyboardEvent) => {
      const isUndo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z";
      if (!isUndo || event.shiftKey) return;

      const element = event.target as HTMLElement | null;
      const typing =
        element?.tagName === "INPUT" ||
        element?.tagName === "TEXTAREA" ||
        element?.isContentEditable;

      // Preserve normal Ctrl+Z while typing inside the add-item form.
      if (typing) return;

      event.preventDefault();
      undoRoadmapEdit();
    };

    window.addEventListener("keydown", handleUndo);
    return () => window.removeEventListener("keydown", handleUndo);
  }, []);

  const [editMode, setEditMode] = useState(false);
  const [timelineView, setTimelineView] = useState<"premed" | "academics">("premed");
  const [editor, setEditor] = useState<EditorRequest>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorSubtitle, setEditorSubtitle] = useState("");
  const [editorSide, setEditorSide] = useState<"left" | "right">("right");

  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<Set<string>>(new Set());
  const hoverCloseTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify([...completed]));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem(roadmapStorageKey, JSON.stringify(roadmap));
  }, [roadmap]);

  const allLeafIds = useMemo(
    () => roadmap.flatMap(m => m.targets.flatMap(t => t.tasks.flatMap(leafIds))),
    [roadmap]
  );

  const overall = allLeafIds.length
    ? Math.round((allLeafIds.filter(id => completed.has(id)).length / allLeafIds.length) * 100)
    : 0;

  const toggleLeaf = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePinned = (id: string) => {
    setPinned(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const setHover = (id: string, value: boolean) => {
    setHovered(prev => {
      const next = new Set(prev);
      value ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const openHoverBranch = (id: string) => {
    const timer = hoverCloseTimers.current[id];
    if (timer) {
      window.clearTimeout(timer);
      delete hoverCloseTimers.current[id];
    }
    setHover(id, true);
  };

  const scheduleHoverClose = (id: string) => {
    const timer = hoverCloseTimers.current[id];
    if (timer) window.clearTimeout(timer);

    hoverCloseTimers.current[id] = window.setTimeout(() => {
      setHover(id, false);
      delete hoverCloseTimers.current[id];
    }, 120);
  };

  const isOpen = (id: string) => pinned.has(id) || hovered.has(id);

  const openEditor = (request: EditorRequest) => {
    setEditor(request);
    setEditorTitle("");
    setEditorSubtitle("");
    if (!request) return;

    const month = roadmap.find(m => m.id === request.monthId);

    if (request.kind === "target") {
      const nextSide = month && month.targets.length % 2 === 0 ? "left" : "right";
      setEditorSide(nextSide);

      if (timelineView === "academics") {
        setEditorTitle("Academics");
        setEditorSubtitle("New academic monthly target");
      }
      return;
    }

    if (request.kind === "edit-target") {
      const target = month?.targets.find(t => t.id === request.targetId);
      if (target) {
        setEditorTitle(target.title);
        setEditorSubtitle(target.subtitle);
        setEditorSide(target.side);
      }
      return;
    }

    const target = "targetId" in request
      ? month?.targets.find(t => t.id === request.targetId)
      : undefined;

    if (request.kind === "edit-subtarget") {
      const task = target?.tasks.find(t => t.id === request.taskId);
      if (task) setEditorTitle(task.title);
    }

    if (request.kind === "edit-leaf") {
      const task = target?.tasks.find(t => t.id === request.taskId);
      const leaf = task?.children?.find(child => child.id === request.leafId);
      if (leaf) setEditorTitle(leaf.title);
    }
  };

  const saveEditor = () => {
    if (!editor || !editorTitle.trim()) return;

    commitRoadmapEdit(prev => prev.map(month => {
      if (month.id !== editor.monthId) return month;

      if (editor.kind === "target") {
        const rawTitle = editorTitle.trim();
        const title =
          timelineView === "academics" && !rawTitle.toLowerCase().includes("academic")
            ? `Academics — ${rawTitle}`
            : rawTitle;

        const newTarget: Target = {
          id: makeId("target"),
          title,
          subtitle: editorSubtitle.trim() || "New monthly target",
          side: editorSide,
          tasks: [],
        };
        return { ...month, targets: [...month.targets, newTarget] };
      }

      if (editor.kind === "edit-target") {
        return {
          ...month,
          targets: month.targets.map(target =>
            target.id !== editor.targetId ? target : {
              ...target,
              title: editorTitle.trim(),
              subtitle: editorSubtitle.trim() || target.subtitle,
              side: editorSide,
            }
          ),
        };
      }

      return {
        ...month,
        targets: month.targets.map(target => {
          if (target.id !== editor.targetId) return target;

          if (editor.kind === "subtarget") {
            const newTask: Task = {
              id: makeId("subtarget"),
              title: editorTitle.trim(),
              children: [],
            };
            return { ...target, tasks: [...target.tasks, newTask] };
          }

          if (editor.kind === "edit-subtarget") {
            return {
              ...target,
              tasks: target.tasks.map(task =>
                task.id === editor.taskId ? { ...task, title: editorTitle.trim() } : task
              ),
            };
          }

          return {
            ...target,
            tasks: target.tasks.map(task => {
              if (task.id !== editor.taskId) return task;

              if (editor.kind === "leaf") {
                const newLeaf: Task = { id: makeId("task"), title: editorTitle.trim() };
                return { ...task, children: [...(task.children ?? []), newLeaf] };
              }

              if (editor.kind === "edit-leaf") {
                return {
                  ...task,
                  children: (task.children ?? []).map(child =>
                    child.id === editor.leafId ? { ...child, title: editorTitle.trim() } : child
                  ),
                };
              }

              return task;
            }),
          };
        }),
      };
    }));

    setEditor(null);
  };

  const removeTarget = (monthId: string, targetId: string) => {
    if (!window.confirm("Remove this target and all of its subtargets/tasks?")) return;
    commitRoadmapEdit(prev => prev.map(month =>
      month.id === monthId
        ? { ...month, targets: month.targets.filter(target => target.id !== targetId) }
        : month
    ));
  };

  const removeSubtarget = (monthId: string, targetId: string, taskId: string) => {
    if (!window.confirm("Remove this subtarget and all of its tasks?")) return;
    commitRoadmapEdit(prev => prev.map(month =>
      month.id !== monthId ? month : {
        ...month,
        targets: month.targets.map(target =>
          target.id !== targetId ? target : {
            ...target,
            tasks: target.tasks.filter(task => task.id !== taskId),
          }
        ),
      }
    ));
  };

  const removeLeaf = (monthId: string, targetId: string, taskId: string, leafId: string) => {
    commitRoadmapEdit(prev => prev.map(month =>
      month.id !== monthId ? month : {
        ...month,
        targets: month.targets.map(target =>
          target.id !== targetId ? target : {
            ...target,
            tasks: target.tasks.map(task =>
              task.id !== taskId ? task : {
                ...task,
                children: (task.children ?? []).filter(child => child.id !== leafId),
              }
            ),
          }
        ),
      }
    ));
    setCompleted(prev => {
      const next = new Set(prev);
      next.delete(leafId);
      return next;
    });
  };

  const reset = () => setCompleted(new Set());

  const isAcademicTarget = (target: Target) =>
    target.title.trim().toLowerCase().includes("academic");

  const visibleRoadmap = roadmap.map(month => ({
    ...month,
    targets: month.targets.filter(target =>
      timelineView === "academics"
        ? isAcademicTarget(target)
        : !isAcademicTarget(target)
    ),
  }));

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">
            {timelineView === "academics" ? "ACADEMIC JOURNEY" : "PRE-MED JOURNEY"}
          </p>
          <h1>
            {timelineView === "academics"
              ? "Academics. Month by month."
              : "One timeline. Clear next steps."}
          </h1>
          <p className="hero-copy">
            {timelineView === "academics"
              ? "Track courses, study systems, prerequisite planning, exam preparation, and academic progress separately."
              : "Explore each monthly target, reveal smaller actions, and check off your progress."}
          </p>
        </div>
        <div className="timeline-switcher" role="group" aria-label="Choose timeline">
          <button
            className={timelineView === "premed" ? "active" : ""}
            onClick={() => setTimelineView("premed")}
          >
            Pre-Med Timeline
          </button>
          <button
            className={timelineView === "academics" ? "active" : ""}
            onClick={() => setTimelineView("academics")}
          >
            Academic Timeline
          </button>
        </div>

        <div className="progress-card">
          <span>Overall progress</span>
          <strong>{overall}%</strong>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${overall}%` }} />
          </div>
          <div className="progress-actions">
            <button onClick={reset}><RotateCcw size={15} /> Reset progress</button>
            <button
              className={editMode ? "active" : ""}
              onClick={() => setEditMode(v => !v)}
            >
              <Pencil size={15} /> {editMode ? "Done editing" : "Edit roadmap"}
            </button>
          </div>
        </div>
      </header>

      <section className="timeline-shell">
        <div className="timeline-line" />
        {visibleRoadmap.map((month, monthIndex) => (
          <section
            className="month"
            key={month.id}
            style={{
              "--target-count": month.targets.length,
              "--month-bg": monthBackgrounds[monthIndex % monthBackgrounds.length],
            } as React.CSSProperties}
          >
            <aside className="month-label">
              <span>{month.label}</span>
              <small>{month.year}</small>
              {editMode && (
                <button
                  className="edit-add month-add"
                  title="Add target"
                  onClick={() => openEditor({ kind: "target", monthId: month.id })}
                >
                  <Plus size={15} />
                </button>
              )}
            </aside>

            <div className="month-node">
              <div className="month-dot" />
            </div>

            <div className="targets">
              {month.targets.map((target, targetIndex) => {
                const targetLeaves = target.tasks.flatMap(leafIds);
                const done = targetLeaves.filter(id => completed.has(id)).length;
                const pct = targetLeaves.length
                  ? Math.round((done / targetLeaves.length) * 100)
                  : 0;
                return (
                  <article
                    className={`target ${target.side} ${pct === 100 ? "complete" : ""}`}
                    key={target.id}
                    style={{ "--delay": `${targetIndex * 70}ms` } as React.CSSProperties}
                    onMouseEnter={() => setHover(target.id, true)}
                    onMouseLeave={() => setHover(target.id, false)}
                  >
                    <button
                      className="target-main"
                      onClick={() => togglePinned(target.id)}
                    >
                      <div>
                        <span className="target-title">{target.title}</span>
                        <span className="target-subtitle">{target.subtitle}</span>
                      </div>
                      <span className="target-progress">{pct}%</span>
                    </button>

                    {editMode && (
                      <div className={`target-edit-tools ${target.side}`}>
                        <button
                          className="edit-icon add"
                          title="Add subtarget"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditor({ kind: "subtarget", monthId: month.id, targetId: target.id });
                          }}
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          className="edit-icon edit"
                          title="Edit target"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditor({ kind: "edit-target", monthId: month.id, targetId: target.id });
                          }}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="edit-icon trash"
                          title="Remove target"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTarget(month.id, target.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}

                    <div className="branch-stem" />
                    <div className={`task-panel ${target.side} ${isOpen(target.id) ? "open" : ""}`}>
                      <svg
                        className="branch-fan"
                        viewBox={`0 0 90 ${Math.max(70, target.tasks.length * 78)}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        {target.tasks.map((task, index) => {
                          const y = 22 + index * 78;
                          const rootY = 31;
                          return target.side === "right" ? (
                            <path
                              key={`curve-${task.id}`}
                              d={`M 0 ${rootY} C 30 ${rootY}, 34 ${y}, 88 ${y}`}
                            />
                          ) : (
                            <path
                              key={`curve-${task.id}`}
                              d={`M 90 ${rootY} C 60 ${rootY}, 56 ${y}, 2 ${y}`}
                            />
                          );
                        })}
                      </svg>
                      {target.tasks.map(task => {
                        const leaves = leafIds(task);
                        const taskDone = leaves.filter(id => completed.has(id)).length;
                        const taskComplete = leaves.length > 0 && taskDone === leaves.length;
                        const taskOpen = isOpen(task.id);

                        return (
                          <div
                            className="task-group"
                            key={task.id}
                            style={{ "--branch-index": target.tasks.indexOf(task) } as React.CSSProperties}
                          >
                            <button
                              className={`subtarget ${taskComplete ? "done" : ""}`}
                              onMouseEnter={() => openHoverBranch(task.id)}
                              onMouseLeave={() => scheduleHoverClose(task.id)}
                              onClick={() => togglePinned(task.id)}
                            >
                              <ChevronRight className={taskOpen ? "rotated" : ""} size={16} />
                              <span>{task.title}</span>
                              <em>{taskDone}/{leaves.length}</em>
                            </button>

                            {editMode && (
                              <div className={`subtarget-edit-tools ${target.side}`}>
                                <button
                                  className="edit-icon add"
                                  title="Add task"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditor({
                                      kind: "leaf",
                                      monthId: month.id,
                                      targetId: target.id,
                                      taskId: task.id,
                                    });
                                  }}
                                >
                                  <Plus size={13} />
                                </button>
                                <button
                                  className="edit-icon edit"
                                  title="Edit subtarget"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditor({
                                      kind: "edit-subtarget",
                                      monthId: month.id,
                                      targetId: target.id,
                                      taskId: task.id,
                                    });
                                  }}
                                >
                                  <Pencil size={12} />
                                </button>
                                <button
                                  className="edit-icon trash"
                                  title="Remove subtarget"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSubtarget(month.id, target.id, task.id);
                                  }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            )}

                            <div
                              className={`leaf-list ${target.side} ${taskOpen ? "open" : ""}`}
                              onMouseEnter={() => openHoverBranch(task.id)}
                              onMouseLeave={() => scheduleHoverClose(task.id)}
                            >
                              <svg
                                className="leaf-branch-fan"
                                viewBox={`0 0 82 ${Math.max(52, (task.children?.length ?? 1) * 48)}`}
                                preserveAspectRatio="none"
                                aria-hidden="true"
                              >
                                {task.children?.map((child, childIndex) => {
                                  const y = 18 + childIndex * 48;
                                  const rootY = 20;
                                  return target.side === "right" ? (
                                    <path
                                      key={`leaf-curve-${child.id}`}
                                      d={`M 0 ${rootY} C 24 ${rootY}, 28 ${y}, 80 ${y}`}
                                    />
                                  ) : (
                                    <path
                                      key={`leaf-curve-${child.id}`}
                                      d={`M 82 ${rootY} C 58 ${rootY}, 54 ${y}, 2 ${y}`}
                                    />
                                  );
                                })}
                              </svg>
                              {task.children?.map((child, childIndex) => (
                                <div
                                  className="leaf"
                                  key={child.id}
                                  style={{ "--leaf-index": childIndex } as React.CSSProperties}
                                >
                                  <label className="leaf-check">
                                    <input
                                      type="checkbox"
                                      checked={completed.has(child.id)}
                                      onChange={() => toggleLeaf(child.id)}
                                    />
                                    <span className="check-box">
                                      {completed.has(child.id) && <Check size={13} />}
                                    </span>
                                    <span className="leaf-text">{child.title}</span>
                                  </label>
                                  {editMode && (
                                    <div className="leaf-edit-tools">
                                      <button
                                        className="edit-icon edit leaf-edit"
                                        title="Edit task"
                                        onClick={() =>
                                          openEditor({
                                            kind: "edit-leaf",
                                            monthId: month.id,
                                            targetId: target.id,
                                            taskId: task.id,
                                            leafId: child.id,
                                          })
                                        }
                                      >
                                        <Pencil size={11} />
                                      </button>
                                      <button
                                        className="edit-icon trash leaf-trash"
                                        title="Remove task"
                                        onClick={() => removeLeaf(month.id, target.id, task.id, child.id)}
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>

            {monthIndex < visibleRoadmap.length - 1 && <div className="month-spacer" />}
          </section>
        ))}
      </section>

      {editor && (
        <div className="editor-backdrop" onMouseDown={() => setEditor(null)}>
          <div className="editor-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="editor-close" onClick={() => setEditor(null)}>
              <X size={18} />
            </button>

            <p className="editor-kicker">
              {editor.kind === "target"
                ? "ADD MONTHLY TARGET"
                : editor.kind === "subtarget"
                  ? "ADD SUBTARGET"
                  : editor.kind === "leaf"
                    ? "ADD TASK"
                    : editor.kind === "edit-target"
                      ? "EDIT MONTHLY TARGET"
                      : editor.kind === "edit-subtarget"
                        ? "EDIT SUBTARGET"
                        : "EDIT TASK"}
            </p>

            <h2>
              {editor.kind === "target"
                ? "What do you want to work on?"
                : editor.kind === "subtarget"
                  ? "Add the next branch"
                  : editor.kind === "leaf"
                    ? "Add a bite-size action"
                    : editor.kind === "edit-target"
                      ? "Revise this monthly target"
                      : editor.kind === "edit-subtarget"
                        ? "Revise this branch"
                        : "Revise this action"}
            </h2>

            <label className="editor-field">
              <span>Title</span>
              <input
                autoFocus
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
                placeholder={
                  editor.kind === "target" || editor.kind === "edit-target"
                    ? "e.g. Leadership"
                    : editor.kind === "subtarget" || editor.kind === "edit-subtarget"
                      ? "e.g. Apply for committee role"
                      : "e.g. Email organization president"
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && editor.kind !== "target" && editor.kind !== "edit-target") saveEditor();
                }}
              />
            </label>

            {(editor.kind === "target" || editor.kind === "edit-target") && (
              <>
                <label className="editor-field">
                  <span>Short description</span>
                  <input
                    value={editorSubtitle}
                    onChange={(e) => setEditorSubtitle(e.target.value)}
                    placeholder="e.g. Build sustained leadership experience"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditor();
                    }}
                  />
                </label>

                <div className="editor-field">
                  <span>Branch side</span>
                  <div className="side-picker">
                    <button
                      className={editorSide === "left" ? "selected" : ""}
                      onClick={() => setEditorSide("left")}
                    >
                      Left
                    </button>
                    <button
                      className={editorSide === "right" ? "selected" : ""}
                      onClick={() => setEditorSide("right")}
                    >
                      Right
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              className="editor-save"
              disabled={!editorTitle.trim()}
              onClick={saveEditor}
            >
              {editor.kind.startsWith("edit-") ? <Pencil size={16} /> : <Plus size={16} />}
              {editor.kind.startsWith("edit-") ? "Save changes" : "Add to timeline"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
