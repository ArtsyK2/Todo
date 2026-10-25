import { useEffect, useMemo, useState } from "react";
import { Check, Plus, X, ListTodo, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "my-tasks-todo-v1";

const starterTasks = [
  { id: "starter-1", text: "Learn React basics", completed: false },
  { id: "starter-2", text: "Build my first application", completed: true }
];

function readTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? starterTasks : JSON.parse(saved);
  } catch {
    return starterTasks;
  }
}

export default function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const remainingCount = tasks.length - completedCount;

  const visibleTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((task) => !task.completed);
    if (filter === "completed") return tasks.filter((task) => task.completed);
    return tasks;
  }, [tasks, filter]);

  function addTask(event) {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    setTasks((current) => [
      ...current,
      { id: crypto.randomUUID(), text, completed: false }
    ]);
    setNewTask("");
    setFilter("all");
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function clearCompleted() {
    setTasks((current) => current.filter((task) => !task.completed));
  }

  return (
    <main className="page">
      <div className="content">
        <header className="hero">
          <div className="app-icon" aria-hidden="true">
            <Check size={43} strokeWidth={2.1} />
          </div>
          <h1>My Tasks</h1>
          <p>Plan your day. Make progress.</p>
        </header>

        <section className="todo-card" aria-label="Todo list">
          <form className="add-form" onSubmit={addTask}>
            <input
              type="text"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="What do you need to do?"
              aria-label="What do you need to do?"
              maxLength={180}
            />
            <button type="submit" className="add-button" disabled={!newTask.trim()}>
              <Plus size={17} strokeWidth={2.7} />
              <span>Add</span>
            </button>
          </form>

          <div className="summary">
            <span>{remainingCount} remaining</span>
            <span>{completedCount} completed</span>
          </div>

          <nav className="filters" aria-label="Filter tasks">
            {[
              { id: "all", label: "All" },
              { id: "active", label: "Active" },
              { id: "completed", label: "Completed" }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={`filter-button ${filter === item.id ? "selected" : ""}`}
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="task-list">
            {visibleTasks.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">
                  {filter === "completed" ? <CheckCircle2 size={25} /> : <ListTodo size={25} />}
                </span>
                <p>{filter === "completed" ? "No completed tasks yet." : filter === "active" ? "You're all caught up!" : "Your list is empty. Add a task above."}</p>
              </div>
            ) : (
              visibleTasks.map((task) => (
                <article className={`task-row ${task.completed ? "completed" : ""}`} key={task.id}>
                  <button
                    type="button"
                    className={`checkbox ${task.completed ? "checked" : ""}`}
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.completed ? `Mark ${task.text} as active` : `Complete ${task.text}`}
                    aria-pressed={task.completed}
                  >
                    {task.completed && <Check size={14} strokeWidth={3} />}
                  </button>
                  <span className="task-text">{task.text}</span>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.text}`}
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </article>
              ))
            )}
          </div>

          <footer className="card-footer">
            <span>{tasks.length} total {tasks.length === 1 ? "task" : "tasks"}</span>
            {completedCount > 0 && (
              <button type="button" className="clear-button" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </footer>
        </section>

        <footer className="page-footer">Small steps every day lead to big results.</footer>
      </div>
    </main>
  );
}