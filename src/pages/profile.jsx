import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

function Profile() {
    const [protectedData, setProtectedData] = useState({});
    const [joinedQuizzes, setJoinedQuizzes] = useState([]);
    const [createdQuizzes, setCreatedQuizzes] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    /*───────────── helpers ─────────────*/
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    /*───────────── data fetch ─────────────*/
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            navigate("/");
            return;
        }

        fetch(import.meta.env.VITE_GET_PROFILE_DATA_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized or error");
                return res.json();
            })
            .then((data) => {
                setProtectedData(data.user || {});
                setJoinedQuizzes(data.user?.joinedQuizes || []);
                setCreatedQuizzes(data.user?.createdQuizes || []);
            })
            .catch((err) => setError(err.message));
    }, [navigate]);

    /*───────────── UI ─────────────*/
    return (
        <div className="min-h-screen ">
            <Navbar />

            {/* main wrapper */}
            <div className="pt-8 pb-10 flex flex-col items-center">
                {error ? (
                    /* error card */
                    <div className="flex items-center justify-center w-full">
                        <div className="max-w-lg mx-4 bg-red-50 border border-red-300 p-6 rounded-xl text-center">
                            <h2 className="text-2xl font-bold text-[#00ADB5] mb-2">
                                Error
                            </h2>
                            <p className="text-red-600">{error}</p>
                        </div>
                    </div>
                ) : (
                    /* profile content */
                    <div className="w-full max-w-5xl px-4">
                        {/* heading */}
                        <h2 className="text-3xl font-bold text-center text-[#00ADB5] mb-8">
                            Profile
                        </h2>

                        {/* user card + created quizzes */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* user info */}
                            <div className="bg-white border-2 border-[#393E46] rounded-xl p-8">
                                <h3 className="text-xl font-semibold text-[#00ADB5] mb-6">
                                    User Information
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        ["Email", protectedData.mail || "N/A"],
                                        ["Name", protectedData.name || "N/A"],
                                        ["Quizzes Created", createdQuizzes.length],
                                        ["Quizzes Joined", joinedQuizzes.length],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="flex justify-between items-center bg-[#EEEEEE] p-3 rounded"
                                        >
                                            <span className="font-semibold text-[#393E46]">
                                                {label}:
                                            </span>
                                            <span
                                                className={
                                                    label.includes("Quizzes")
                                                        ? "font-bold text-[#00ADB5]"
                                                        : "text-[#222831]"
                                                }
                                            >
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* created quizzes */}
                            <div className="bg-white border-2 border-[#393E46] rounded-xl p-8">
                                <h3 className="text-xl font-semibold text-[#00ADB5] mb-6">
                                    Created Quizzes
                                </h3>
                                {createdQuizzes.length ? (
                                    <>
                                        <div className="space-y-3">
                                            {createdQuizzes.slice(0, 5).map((quiz, idx) => (
                                                <button
                                                    key={quiz.id}
                                                    type="button"
                                                    onClick={() => {
                                                        if (quiz.closed) {
                                                            localStorage.setItem("codeQuiz", quiz.id);
                                                            navigate("/qzinfo");
                                                        } else {
                                                            localStorage.setItem("quizCode", quiz.id);
                                                            navigate("/quiz-dashboard");
                                                        }

                                                    }}
                                                    className="w-full flex justify-between items-center bg-[#EEEEEE] hover:bg-[#00ADB5]/20 p-3 rounded transition-colors"
                                                >
                                                    <span className="text-[#222831] font-medium">
                                                        {quiz.title}
                                                    </span>
                                                    <span className="text-sm text-[#393E46]">
                                                        {quiz.closed ? "closed" : "active"}
                                                    </span>
                                                    <span className="text-sm text-[#393E46]">
                                                        Quiz #{idx + 1}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        {createdQuizzes.length > 5 && (
                                            <p className="text-center text-sm text-[#393E46] mt-3">
                                                +{createdQuizzes.length - 5} more quizzes
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center text-[#393E46] py-8">
                                        <p className="mb-4">No quizzes created yet.</p>
                                        <button
                                            onClick={() => navigate("/create-quiz")}
                                            className="px-5 py-2 rounded font-semibold bg-[#00ADB5] text-[#EEEEEE] hover:bg-[#393E46] transition-colors"
                                        >
                                            Create Your First Quiz
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* joined quizzes list */}
                        {joinedQuizzes.length ? (
                            <div className="mt-10 bg-white border-2 border-[#393E46] rounded-xl p-8">
                                <h3 className="text-xl font-semibold text-[#00ADB5] mb-6">
                                    Recent Quiz Results
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {joinedQuizzes.slice(0, 6).map((res) => (
                                        <button
                                            key={res.id}
                                            type="button"
                                            onClick={() => {
                                                localStorage.setItem("idQZ", res.quiz_id);
                                                localStorage.setItem("qId", res.id);
                                                navigate("/qzanalysis");
                                            }}
                                            className="bg-[#EEEEEE] hover:bg-[#7fe2e8]/60 p-4 rounded-xl border border-[#393E46] transition-colors"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-semibold text-[#393E46]">
                                                    {res.quiz_title}
                                                </span>
                                                <span className="text-lg font-bold text-[#00ADB5]">
                                                    {res.score}/{res.total_questions}
                                                </span>
                                            </div>
                                            <div className="text-center">
                                                <span className="text-2xl font-bold text-[#222831]">
                                                    {res.points} pts
                                                </span>
                                            </div>
                                            {/* progress bar */}
                                            <div className="mt-3">
                                                <div className="w-full bg-[#393E46] h-2 rounded-full">
                                                    <div
                                                        className="bg-[#00ADB5] h-2 rounded-full"
                                                        style={{
                                                            width: `${(res.score / res.total_questions) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                                <div className="text-xs text-center mt-1 text-[#393E46]">
                                                    {Math.round(
                                                        (res.score / res.total_questions) * 100
                                                    )}
                                                    % Score
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {joinedQuizzes.length > 6 && (
                                    <p className="text-center text-sm text-[#393E46] mt-4">
                                        Showing 6 of {joinedQuizzes.length} quiz results
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="mt-10 bg-white border-2 border-[#393E46] rounded-xl p-8 text-center">
                                <h3 className="text-xl font-semibold text-[#00ADB5] mb-4">
                                    No Quiz Results Yet
                                </h3>
                                <p className="text-[#222831] mb-4">
                                    You haven't joined any quizzes yet. Start your learning
                                    journey!
                                </p>
                                <button
                                    onClick={() => navigate("/join-quiz")}
                                    className="px-6 py-2 rounded font-semibold bg-[#00ADB5] text-[#EEEEEE] hover:bg-[#393E46] transition-colors"
                                >
                                    Join a Quiz
                                </button>
                            </div>
                        )}

                        {/* footer buttons (smaller) */}
                        <div className="mt-12 flex justify-center gap-4">
                            <button
                                onClick={() => navigate("/home")}
                                className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#393E46] text-[#EEEEEE] hover:bg-[#222831] transition-colors"
                            >
                                Home
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
