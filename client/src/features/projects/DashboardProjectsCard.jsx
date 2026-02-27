import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./dashboardProjectCard.css";

export default function DashboardProjectsCard() {
    const statusClass = (s = "") => {
        const v = s.toLowerCase();
        if (v.includes("complete")) return "bg-green-100 text-green-700";
        if (v.includes("progress") || v.includes("ongoing")) return "bg-amber-100 text-amber-700";
        if (v.includes("not")) return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-700";
    };

    const projects = useSelector((s) => s.projects.projects);
    const nav = useNavigate();

    const recentProjects = projects; 

    return (
        <div className="projects-card">
            <div className="top-line">
                <h2>Projects</h2>
                <button className="view-btn" onClick={() => nav("/projects")} type="button">
                    View All
                </button>
            </div>

            <div className="projects-list">
                {recentProjects.length === 0 ? (
                    <p>No projects</p>
                ) : (
                    <ul>
                        {recentProjects.map((p) => {
                            const count = Number(p.task_count) || 0;

                            return (
                                <li
                                    key={p.id}
                                    onClick={() => nav(`/projects/${p.id}`)}
                                    className={`project-item ${statusClass(p.status)}`}
                                >
                                    <div className="project-details">
                                        <div className="left">
                                            <span className="name">{p.name}</span>
                                            <span className="count">
                                                {count} {count === 1 ? "task" : "tasks"}
                                            </span>
                                        </div>

                                        <div className="right">
                                            <span className="completion">
                                                Scheduled completion:{" "}
                                                {p.scheduled_completion
                                                    ? new Date(p.scheduled_completion).toLocaleDateString("en-GB")
                                                    : "—"}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}