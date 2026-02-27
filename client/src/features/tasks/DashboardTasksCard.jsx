import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./dashboardTasksCard.css";

export default function DashboardTasksCard() {
    const max = 20;

    const tasks = useSelector((s) => s.tasks.tasks);
    const nav = useNavigate();

    const upcomingTasks = useMemo(() => {
        return [...tasks]
            // only tasks with a due date and not completed
            .filter((t) => t.due_date && Number(t.progress) < 100)
            // soonest first
            .sort((a, b) => +new Date(a.due_date) - +new Date(b.due_date))

    }, [tasks]);

    const statusFromProgress = (p = 0) =>
        p >= 100 ? "Complete" : p > 0 ? "Ongoing" : "Todo";

    const handleTaskClick = () => {
        nav("/tasks");
    };

    return (
        <div className="tasks-card">
            <div className="top-line">
                <h2>Upcoming Task ({upcomingTasks.length})</h2>
                <button className="view-btn" onClick={() => nav("/tasks")}>
                    View All
                </button>
            </div>

            {upcomingTasks.length === 0 ? (
                <p>No upcoming Tasks...</p>
            ) : (
                <div className="tasks-list scrollable">
                    <ul>
                        {upcomingTasks.map((t) => (
                            <li key={t.id} onClick={handleTaskClick}>
                                <div className="details">
                                    <span className="name">{t.title}</span>

                                    <div className="bottom">
                                        <span className="date">
                                            Due: {new Date(t.due_date).toLocaleDateString("en-GB")}
                                        </span>
                                        <span className="progress">
                                            Status: {statusFromProgress(t.progress)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}