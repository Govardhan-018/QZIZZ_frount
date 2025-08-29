import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

function Profile() {
    const [protectedData, setProtectedData] = useState({});
    const [joinedQuizzes, setJoinedQuizzes] = useState([]);
    const [createdQuizzes, setCreatedQuizzes] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="flex flex-col items-center justify-center w-full px-4 pt-20">
                <div className="w-full max-w-3xl">
                    {error ? (
                        <div className="w-full mb-4 rounded bg-red-50 border border-red-300 text-red-700 px-3 py-2 text-center">
                            {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* User Info Card */}
                            <div className="bg-white rounded-xl border-2 border-[#393E46] p-8 shadow">
                                <h1 className="text-3xl font-bold mb-2 text-[#00ADB5] text-center">Profile</h1>
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-[#00ADB5] flex items-center justify-center text-white font-bold text-xl border-2 border-[#393E46]">
                                        {(protectedData.name || "U").charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="mb-2 text-[#222831] text-center">
                                    <span className="font-semibold">Name:</span> {protectedData.name || "N/A"}
                                </div>
                                <div className="mb-2 text-[#222831] text-center break-all">
                                    <span className="font-semibold">Email:</span> {protectedData.mail || "N/A"}
                                </div>
                                <div className="mb-2 text-[#222831] text-center">
                                    <span className="font-semibold">Quizzes Created:</span> {createdQuizzes.length}
                                </div>
                                <div className="mb-2 text-[#222831] text-center">
                                    <span className="font-semibold">Quizzes Joined:</span> {joinedQuizzes.length}
                                </div>
                            </div>

                            {/* Created Quizzes Card */}
                            <div className="bg-white rounded-xl border-2 border-[#393E46] p-8 shadow">
                                <h2 className="text-2xl font-bold mb-4 text-[#00ADB5] text-center">Created Quizzes</h2>
                                {createdQuizzes.length ? (
                                    <ul className="space-y-2">
                                        {createdQuizzes.slice(0, 5).map((quiz, idx) => (
                                            <li key={quiz.id}>
                                                <button
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
                                                    className="w-full bg-[#F7F7F7] hover:bg-[#00ADB5]/10 p-3 rounded-lg transition border border-[#393E46]/10 hover:border-[#00ADB5]/20 text-left flex justify-between items-center"
                                                >
                                                    <span className="text-[#222831] font-medium truncate">{quiz.title}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        quiz.closed ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                    }`}>
                                                        {quiz.closed ? "Closed" : "Active"}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center text-[#393E46] py-6">
                                        <p className="mb-4 text-sm">No quizzes created yet.</p>
                                        <button
                                            onClick={() => navigate("/create-quiz")}
                                            className="px-6 py-3 rounded-lg font-semibold bg-[#00ADB5] text-white hover:bg-[#393E46] transition"
                                        >
                                            Create Your First Quiz
                                        </button>
                                    </div>
                                )}
                                {createdQuizzes.length > 5 && (
                                    <p className="text-center text-xs text-[#393E46] mt-3">
                                        +{createdQuizzes.length - 5} more quizzes
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Joined Quizzes Section */}
                    {!error && (
                        <div className="bg-white rounded-xl border-2 border-[#393E46] p-8 shadow mt-6">
                            <h2 className="text-2xl font-bold mb-4 text-[#00ADB5] text-center">Recent Quiz Results</h2>
                            {joinedQuizzes.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {joinedQuizzes.slice(0, 6).map((res) => (
                                        <button
                                            key={res.id}
                                            type="button"
                                            onClick={() => {
                                                localStorage.setItem("idQZ", res.quiz_id);
                                                localStorage.setItem("qId", res.id);
                                                navigate("/qzanalysis");
                                            }}
                                            className="bg-[#F7F7F7] hover:bg-[#00ADB5]/10 p-4 rounded-lg border border-[#393E46]/10 hover:border-[#00ADB5]/30 transition text-left"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[#222831] font-semibold truncate">{res.quiz_title}</span>
                                                <span className="bg-[#00ADB5] text-white px-2 py-1 rounded-lg text-xs font-bold">
                                                    {res.score}/{res.total_questions}
                                                </span>
                                            </div>
                                            <div className="text-center mb-2">
                                                <span className="text-xl font-bold text-[#222831]">{res.points}</span>
                                                <span className="text-xs text-[#393E46] ml-1">pts</span>
                                            </div>
                                            <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden mb-1">
                                                <div
                                                    className="bg-gradient-to-r from-[#00ADB5] to-[#393E46] h-2 rounded-full"
                                                    style={{
                                                        width: `${(res.score / res.total_questions) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <div className="text-xs text-center text-[#393E46]">
                                                {Math.round((res.score / res.total_questions) * 100)}% Score
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-[#393E46] py-6">
                                    <p className="mb-4 text-sm">You haven't joined any quizzes yet.</p>
                                    <button
                                        onClick={() => navigate("/join-quiz")}
                                        className="px-6 py-3 rounded-lg font-semibold bg-[#393E46] text-white hover:bg-[#00ADB5] transition"
                                    >
                                        Join a Quiz
                                    </button>
                                </div>
                            )}
                            {joinedQuizzes.length > 6 && (
                                <p className="text-center text-xs text-[#393E46] mt-4">
                                    Showing 6 of {joinedQuizzes.length} quiz results
                                </p>
                            )}
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <div className="mt-8 flex flex-col md:flex-row justify-center gap-4 px-4">
                        <button
                            onClick={() => navigate("/home")}
                            className="w-full md:w-auto px-6 py-3 rounded-lg font-semibold bg-[#393E46] text-[#EEEEEE] hover:bg-[#222831] transition"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full md:w-auto px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
