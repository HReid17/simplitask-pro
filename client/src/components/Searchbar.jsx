import { useMemo, useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import searchIcon from "../assets/search-interface-symbol.png";
import "./Searchbar.css";

export default function Searchbar() {
    const [q, setQ] = useState("");
    const tasks = useSelector((s) => s.tasks.tasks);
    const projects = useSelector((s) => s.projects.projects);

    const searchRef = useRef(null);
    const nav = useNavigate();

    // Combined results: tasks + projects
    const results = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return [];

        const taskResults = tasks
            .filter((t) => (t.title || "").toLowerCase().includes(query)) 
            .map((t) => ({
                type: "task",
                id: t.id,
                label: t.title,
                meta: t.due_date ? `Due ${new Date(t.due_date).toLocaleDateString("en-GB")}` : "",
            }));

        const projectResults = projects
            .filter((p) => (p.name || "").toLowerCase().includes(query))
            .map((p) => ({
                type: "project",
                id: p.id,
                label: p.name,
                meta: p.status || "",
            }));

        // simple ordering: tasks first, then projects
        return [...taskResults, ...projectResults].slice(0, 8);
    }, [q, tasks, projects]);

    const handleSelect = (item) => {
        if (item.type === "task") {
            nav("/tasks");       // just go to tasks page
        } else {
            nav(`/projects/${item.id}`);
        }

        setQ("");
        document.activeElement.blur();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setQ("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="searchbar" ref={searchRef}>
            <form onSubmit={(e) => e.preventDefault()}>
                <button type="submit">
                    <img src={searchIcon} alt="Search" className="search-icon" />
                </button>

                <input
                    type="search"
                    placeholder="Search tasks or projects..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />

                {q && results.length > 0 && (
                    <ul className="task-search-results">
                        {results.map((r) => (
                            <li key={`${r.type}-${r.id}`} onClick={() => handleSelect(r)}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                    <span>
                                        <strong style={{ textTransform: "capitalize" }}>{r.type}:</strong> {r.label}
                                    </span>
                                    {r.meta ? (
                                        <span style={{ opacity: 0.7, fontSize: 12, whiteSpace: "nowrap" }}>{r.meta}</span>
                                    ) : null}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {q && results.length === 0 && (
                    <div className="task-search-empty">No matches</div>
                )}
            </form>
        </div>
    );
}