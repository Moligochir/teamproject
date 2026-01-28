"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/Languagecontext";
import { useUser } from "@clerk/nextjs";

type LeaderboardUser = {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  reunited: number;
  activeCount: number;
  postCount: number;
  messageCount: number;
  badges: string[];
  rank: number;
  points: number;
};

export default function LeaderboardPage() {
  const { language } = useLanguage();
  const { user: clerkUser } = useUser();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [timeframe, setTimeframe] = useState<"monthly" | "alltime">("monthly");
  const [category, setCategory] = useState<"reunited" | "active" | "reporters">(
    "reunited",
  );
  const [currentUserRank, setCurrentUserRank] =
    useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  const translations = {
    mn: {
      title: "🏆 Үндэсний Жагсаалт",
      subtitle: "Хамгийн идэвхилүүлэн оролцож байгаа хэрэглэгчид",

      tabs: {
        reunited: "Олдсон Амьтан",
        active: "Идэвхилэл",
        reporters: "Мэдээлэгчид",
      },

      timeframe: {
        monthly: "Энэ сар",
        alltime: "Бүх цагийн",
      },

      badges: {
        gold: "🥇 Алтан",
        silver: "🥈 Мөнгө",
        bronze: "🥉 Хүрэл",
        helper: "🌟 Тусалсан",
        founder: "👑 Үндэслэгч",
        verified: "✅ Баталгаажсан",
      },

      stats: {
        reunited: "Олдсон",
        messages: "Мессеж",
        posts: "Зарлал",
        points: "Оноо",
      },

      yourRank: "Таны Зэрэглэл",
      rank: "Зэрэг",
      points: "Оноо",
      noData: "Мэдээлэл байхгүй",
      shareAchievement: "Ололтоо хуваалцах",
    },
    en: {
      title: "🏆 National Leaderboard",
      subtitle: "Most active contributors",

      tabs: {
        reunited: "Reunited Pets",
        active: "Activity",
        reporters: "Top Reporters",
      },

      timeframe: {
        monthly: "This Month",
        alltime: "All Time",
      },

      badges: {
        gold: "🥇 Gold",
        silver: "🥈 Silver",
        bronze: "🥉 Bronze",
        helper: "🌟 Helper",
        founder: "👑 Founder",
        verified: "✅ Verified",
      },

      stats: {
        reunited: "Reunited",
        messages: "Messages",
        posts: "Posts",
        points: "Points",
      },

      yourRank: "Your Rank",
      rank: "Rank",
      points: "Points",
      noData: "No data",
      shareAchievement: "Share Achievement",
    },
  };

  const t = translations[language];

  const getBadges = (user: LeaderboardUser) => {
    const badges = [];
    if (user.reunited >= 10) badges.push("gold");
    else if (user.reunited >= 5) badges.push("silver");
    else if (user.reunited >= 1) badges.push("bronze");

    if (user.messageCount > 50) badges.push("helper");
    if (user._id === "founder-id") badges.push("founder");

    return badges;
  };

  const getPoints = (reunited: number, messages: number, posts: number) => {
    return reunited * 100 + messages * 5 + posts * 20;
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        });
        const users = await res.json();

        // Process users to get statistics
        const processedUsers = await Promise.all(
          users.map(async (user: any) => {
            // Get user's posts count
            const postsRes = await fetch(
              `http://localhost:8000/lostFound?userId=${user._id}`,
            );
            const posts = await postsRes.json();
            const userPosts = posts.filter((p: any) => p.userId === user._id);

            // Calculate reunited count (posts marked as Found)
            const reunited = userPosts.filter(
              (p: any) => p.role === "Found",
            ).length;

            return {
              ...user,
              reunited: reunited,
              activeCount: userPosts.length,
              postCount: userPosts.length,
              messageCount: Math.floor(Math.random() * 100), // Simulated
              badges: getBadges({
                ...user,
                reunited,
                messageCount: Math.floor(Math.random() * 100),
              }),
              points: getPoints(
                reunited,
                Math.floor(Math.random() * 100),
                userPosts.length,
              ),
            };
          }),
        );

        // Sort by selected category
        let sorted = [...processedUsers];
        if (category === "reunited") {
          sorted.sort((a, b) => b.reunited - a.reunited);
        } else if (category === "active") {
          sorted.sort((a, b) => b.messageCount - a.messageCount);
        } else {
          sorted.sort((a, b) => b.postCount - a.postCount);
        }

        // Add ranks
        sorted = sorted.map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

        setLeaderboardData(sorted);

        // Get current user rank
        const userRank = sorted.find((u) => u.clerkId === clerkUser?.id);
        if (userRank) {
          setCurrentUserRank(userRank);
        }
      } catch (err) {
        console.log("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [clerkUser?.id, category]);

  const getBadgeEmoji = (badge: string) => {
    const badgeMap: Record<string, string> = {
      gold: "🥇",
      silver: "🥈",
      bronze: "🥉",
      helper: "🌟",
      founder: "👑",
      verified: "✅",
    };
    return badgeMap[badge] || "⭐";
  };

  return (
    <div className="min-h-screen py-12 bg-linear-to-b from-background to-card-bg/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-xl text-muted mb-8">{t.subtitle}</p>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {(["reunited", "active", "reporters"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  category === cat
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg"
                    : "bg-card-bg border-2 border-card-border hover:border-orange-500 text-muted"
                }`}
              >
                {t.tabs[cat]}
              </button>
            ))}
          </div>

          {/* Timeframe Toggle */}
          <div className="flex gap-2 justify-center mb-8">
            {(["monthly", "alltime"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeframe === tf
                    ? "bg-primary text-white"
                    : "bg-card-bg text-muted hover:bg-primary/10"
                }`}
              >
                {t.timeframe[tf]}
              </button>
            ))}
          </div>
        </div>

        {/* Your Rank Card */}
        {currentUserRank && (
          <div className="mb-12 bg-gradient-to-r from-orange-500/10 to-rose-500/10 border-2 border-orange-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-muted text-sm mb-2">{t.yourRank}</p>
                <p className="text-3xl font-bold text-orange-500">
                  #{currentUserRank.rank}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted text-sm mb-2">{t.stats.points}</p>
                <p className="text-3xl font-bold text-rose-500">
                  {currentUserRank.points}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted text-sm mb-2">{t.stats.reunited}</p>
                <p className="text-3xl font-bold text-green-500">
                  {currentUserRank.reunited}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted text-sm mb-2">Badges</p>
                <div className="flex justify-center gap-2">
                  {currentUserRank.badges.map((badge) => (
                    <span key={badge} className="text-2xl">
                      {getBadgeEmoji(badge)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold hover:shadow-lg transition-all">
              {t.shareAchievement} 🚀
            </button>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-muted">{t.noData}</div>
          ) : (
            <div className="space-y-2 p-4">
              {leaderboardData.slice(0, 20).map((user, idx) => (
                <div
                  key={user._id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    idx < 3
                      ? "bg-gradient-to-r from-orange-500/10 to-rose-500/10 border-l-4 border-orange-500"
                      : "hover:bg-primary/5"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {idx === 0
                      ? "🥇"
                      : idx === 1
                        ? "🥈"
                        : idx === 2
                          ? "🥉"
                          : user.rank}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-lg truncate">{user.name}</p>
                      <div className="flex gap-1">
                        {user.badges.slice(0, 3).map((badge) => (
                          <span key={badge} className="text-lg">
                            {getBadgeEmoji(badge)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-muted">
                      <span>
                        {t.stats.reunited}: {user.reunited}
                      </span>
                      <span>
                        {t.stats.messages}: {user.messageCount}
                      </span>
                      <span>
                        {t.stats.posts}: {user.postCount}
                      </span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-orange-500">
                      {user.points}
                    </p>
                    <p className="text-xs text-muted">{t.stats.points}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badge Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-card-bg rounded-xl p-6 border border-card-border">
            <h3 className="text-xl font-bold mb-4">🏅 {t.badges.gold}</h3>
            <p className="text-muted text-sm">
              {language === "mn"
                ? "10 ба түүнээс дээш амьтныг олох"
                : "Reunite 10+ pets"}
            </p>
          </div>
          <div className="bg-card-bg rounded-xl p-6 border border-card-border">
            <h3 className="text-xl font-bold mb-4">🏅 {t.badges.silver}</h3>
            <p className="text-muted text-sm">
              {language === "mn" ? "5-9 амьтныг олох" : "Reunite 5-9 pets"}
            </p>
          </div>
          <div className="bg-card-bg rounded-xl p-6 border border-card-border">
            <h3 className="text-xl font-bold mb-4">🏅 {t.badges.bronze}</h3>
            <p className="text-muted text-sm">
              {language === "mn" ? "1-4 амьтныг олох" : "Reunite 1-4 pets"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
