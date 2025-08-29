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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            {/* main wrapper - mobile-first responsive container */}
            <div className="pt-4 sm:pt-6 lg:pt-8 pb-6 sm:pb-8 lg:pb-10 px-3 sm:px-4 lg:px-6">
                {error ? (
                    /* error card - responsive */
                    <div className="flex items-center justify-center w-full max-w-md mx-auto">
                        <div className="bg-red-50 border border-red-300 p-4 sm:p-6 rounded-xl shadow-lg text-center w-full">
                            <div className="text-red-500 mb-3">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#00ADB5] mb-2">
                                Error
                            </h2>
                            <p className="text-red-600 text-sm sm:text-base">{error}</p>
                        </div>
                    </div>
                ) : (
                    /* profile content - responsive layout */
                    <div className="w-full max-w-7xl mx-auto">
                        {/* heading - responsive typography */}
                        <div className="text-center mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00ADB5] to-[#393E46] bg-clip-text text-transparent">
                                Profile Dashboard
                            </h1>
                            <p className="text-gray-600 mt-2 text-sm sm:text-base">
                                Welcome back, {protectedData.name || "User"}!
                            </p>
                        </div>

                        {/* user info + created quizzes - responsive grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                            {/* user info card - mobile optimized */}
                            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#00ADB5] to-[#393E46] rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                        <span className="text-white font-bold text-sm sm:text-base">
                                            {(protectedData.name || "U").charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-[#00ADB5]">
                                        User Information
                                    </h3>
                                </div>
                                
                                <div className="space-y-3 sm:space-y-4">
                                    {[
                                        ["Email", protectedData.mail || "N/A"],
                                        ["Name", protectedData.name || "N/A"],
                                        ["Quizzes Created", createdQuizzes.length],
                                        ["Quizzes Joined", joinedQuizzes.length],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="font-semibold text-[#393E46] text-sm sm:text-base mb-1 sm:mb-0">
                                                {label}:
                                            </span>
                                            <span
                                                className={`text-sm sm:text-base ${
                                                    label.includes("Quizzes")
                                                        ? "font-bold text-[#00ADB5]"
                                                        : "text-[#222831]"
                                                } ${label === "Email" ? "break-all" : ""}`}
                                            >
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* created quizzes - mobile optimized */}
                            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#00ADB5] to-[#393E46] rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-[#00ADB5]">
                                        Created Quizzes
                                    </h3>
                                </div>
                                
                                {createdQuizzes.length ? (
                                    <>
                                        <div className="space-y-2 sm:space-y-3">
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
                                                    className="w-full bg-gray-50 hover:bg-[#00ADB5]/10 p-3 sm:p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-[#00ADB5]/20"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-left">
                                                        <span className="text-[#222831] font-medium text-sm sm:text-base mb-1 sm:mb-0 truncate">
                                                            {quiz.title}
                                                        </span>
                                                        <div className="flex justify-between sm:justify-end sm:gap-3">
                                                            <span className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                                                                quiz.closed 
                                                                    ? "bg-red-100 text-red-700" 
                                                                    : "bg-green-100 text-green-700"
                                                            }`}>
                                                                {quiz.closed ? "Closed" : "Active"}
                                                            </span>
                                                            <span className="text-xs sm:text-sm text-[#393E46] hidden sm:inline">
                                                                #{idx + 1}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {createdQuizzes.length > 5 && (
                                            <p className="text-center text-xs sm:text-sm text-[#393E46] mt-3 sm:mt-4">
                                                +{createdQuizzes.length - 5} more quizzes
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center text-[#393E46] py-6 sm:py-8">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <p className="mb-4 text-sm sm:text-base">No quizzes created yet.</p>
                                        <button
                                            onClick={() => navigate("/create-quiz")}
                                            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold bg-gradient-to-r from-[#00ADB5] to-[#393E46] text-white hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
                                        >
                                            Create Your First Quiz
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* joined quizzes section - responsive */}
                        {joinedQuizzes.length ? (
                            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#00ADB5] to-[#393E46] rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-[#00ADB5]">
                                        Recent Quiz Results
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {joinedQuizzes.slice(0, 6).map((res) => (
                                        <button
                                            key={res.id}
                                            type="button"
                                            onClick={() => {
                                                localStorage.setItem("idQZ", res.quiz_id);
                                                localStorage.setItem("qId", res.id);
                                                navigate("/qzanalysis");
                                            }}
                                            className="bg-gray-50 hover:bg-[#00ADB5]/10 p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-[#00ADB5]/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-xs sm:text-sm font-semibold text-[#393E46] line-clamp-2 flex-1 mr-2">
                                                    {res.quiz_title}
                                                </span>
                                                <div className="bg-[#00ADB5] text-white px-2 py-1 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap">
                                                    {res.score}/{res.total_questions}
                                                </div>
                                            </div>
                                            
                                            <div className="text-center mb-3">
                                                <span className="text-xl sm:text-2xl font-bold text-[#222831]">
                                                    {res.points}
                                                </span>
                                                <span className="text-xs sm:text-sm text-[#393E46] ml-1">pts</span>
                                            </div>
                                            
                                            {/* progress bar - responsive */}
                                            <div className="space-y-2">
                                                <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-[#00ADB5] to-[#393E46] h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${(res.score / res.total_questions) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                                <div className="text-xs text-center text-[#393E46]">
                                                    {Math.round((res.score / res.total_questions) * 100)}% Score
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                
                                {joinedQuizzes.length > 6 && (
                                    <p className="text-center text-xs sm:text-sm text-[#393E46] mt-4">
                                        Showing 6 of {joinedQuizzes.length} quiz results
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg text-center">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-[#00ADB5] mb-3 sm:mb-4">
                                    No Quiz Results Yet
                                </h3>
                                <p className="text-[#222831] mb-4 sm:mb-6 text-sm sm:text-base">
                                    You haven't joined any quizzes yet. Start your learning journey today!
                                </p>
                                <button
                                    onClick={() => navigate("/join-quiz")}
                                    className="px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold bg-gradient-to-r from-[#00ADB5] to-[#393E46] text-white hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
                                >
                                    Join a Quiz
                                </button>
                            </div>
                        )}

                        {/* footer buttons - responsive */}
                        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
                            <button
                                onClick={() => navigate("/home")}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-semibold bg-[#393E46] text-[#EEEEEE] hover:bg-[#222831] transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
                            >
                                Back to Home
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
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
