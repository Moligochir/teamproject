"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../contexts/Languagecontext";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SuccessNotification } from "../components/SuccesNotif";
import {
  ActivityEdit,
  DeleteIcon,
  EditIcon,
  FoundIcon,
} from "../components/icons";
import { Loading } from "../components/profileLoading";

type userType = {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  role: string;
  phonenumber: number;
};

type PostType = {
  _id: string;
  userId: string;
  name: string;
  petType: string;
  breed?: string;
  description: string;
  role: "Lost" | "Found";
  image: string;
  location: string;
  createdAt: string;
  updatedAt: string;
};

type ActivityType = {
  _id: string;
  userId: string;
  action: "created" | "edited" | "deleted" | "viewed" | "contacted";
  postId: string;
  postName: string;
  postImage: string;
  details: string;
  timestamp: string;
  targetUserId?: string;
  targetUserName?: string;
};

// Activity tracking service
export const ActivityService = {
  logActivity: (activity: Omit<ActivityType, "_id">) => {
    try {
      const stored = localStorage.getItem("pawfinder_activities");
      const allActivities: ActivityType[] = stored ? JSON.parse(stored) : [];

      const newActivity: ActivityType = {
        ...activity,
        _id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };

      const updated = [newActivity, ...allActivities].slice(0, 200);
      localStorage.setItem("pawfinder_activities", JSON.stringify(updated));

      return newActivity;
    } catch (err) {
      console.log("Error logging activity:", err);
      return null;
    }
  },

  getUserActivities: (userId: string): ActivityType[] => {
    try {
      const stored = localStorage.getItem("pawfinder_activities");
      if (!stored) return [];

      const allActivities = JSON.parse(stored) as ActivityType[];
      return allActivities
        .filter((a) => a.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
    } catch (err) {
      console.log("Error getting activities:", err);
      return [];
    }
  },

  clearUserActivities: (userId: string) => {
    try {
      const stored = localStorage.getItem("pawfinder_activities");
      if (!stored) return;

      const allActivities = JSON.parse(stored) as ActivityType[];
      const updated = allActivities.filter((a) => a.userId !== userId);
      localStorage.setItem("pawfinder_activities", JSON.stringify(updated));
    } catch (err) {
      console.log("Error clearing activities:", err);
    }
  },
};

export default function ProfilePage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { language, toggleLanguage } = useLanguage();
  const [userData, setUserData] = useState<userType | null>(null);
  const [myPosts, setMyPosts] = useState<PostType[]>([]);
  const [matchedPosts, setMatchedPosts] = useState<PostType[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const [editForm, setEditForm] = useState({
    name: "",
    petType: "",
    breed: "",
    description: "",
    role: "Lost" as "Lost" | "Found",
    location: "",
  });

  const [contactForm, setContactForm] = useState({
    message: "",
    phone: "",
  });

  const translations = {
    mn: {
      myProfile: "Миний профайл",
      memberSince: "Гишүүнээр элссэн",
      totalPosts: "Нийт зар",
      reunited: "Олдсон",
      activePosts: "Төөрсөн",
      myPosts: "Миний зарлалууд",
      activity: "Идэвхилэл",
      matches: "Тохиролууд",
      settings: "Тохиргоо",
      edit: "Засах",
      delete: "Устгах",
      contact: "Холбогдох",
      viewDetails: "Дэлгэрэнгүй",
      noPosts: "Танд зар байхгүй байна",
      noPostsDesc: "Төөрсөн эсвэл олдсон амьтны мэдээлэл оруулж эхлээрэй",
      createPost: "Зар үүсгэх",
      lost: "Төөрсөн",
      found: "Олдсон",
      dog: "Нохой",
      cat: "Муур",
      personalInfo: "Хувийн мэдээлэл",
      name: "Нэр",
      email: "Имэйл",
      phone: "Утас",
      password: "Нууц үг",
      changePassword: "Нууц үг солих",
      notifications: "Мэдэгдэл",
      emailNotif: "Имэйл мэдэгдэл",
      emailNotifDesc: "Шинэ тохирол болон мессеж ирэхэд имэйл илгээх",
      pushNotif: "Push мэдэгдэл",
      pushNotifDesc: "Аппликэйшн дээр мэдэгдэл харуулах",
      saveChanges: "Өөрчлөлт хадгалах",
      cancel: "Цуцлах",
      accountSettings: "Акаунтын тохиргоо",
      deleteAccount: "Акаунт устгах",
      deleteAccountDesc: "Таны бүх өгөгдөл бүрмөсөн устах болно",
      deleteBtn: "Акаунт устгах",
      loading: "Уншиж байна...",
      editPost: "Зар засах",
      petName: "Амьтны нэр",
      petType: "Төрөл",
      breed: "Үүлдэр",
      description: "Тайлбар",
      location: "Байршил",
      status: "Төлөв",
      deleteConfirm: "Та энэ зарыг устгахдаа итгэлтэй байна уу?",
      deleteWarning: "Энэ үйлдлийг буцаах боломжгүй. Зар бүрмөсөн устах болно.",
      confirmDelete: "Тийм, устга",
      saving: "Хадгалж байна...",
      deleting: "Устгаж байна...",
      editSuccess: "✓ Зар амжилттай засагдлаа",
      deleteSuccess: "✓ Зар амжилттай устгагдлаа",
      contactSuccess: "✓ Эзэмшигчтэй холбогдлоо",
      editError: "Зар засахад алдаа гарлаа",
      deleteError: "Зар устгахад алдаа гарлаа",
      contactError: "Холбогдоход алдаа гарлаа",
      type: "Төрөл:",
      breedd: "Үүлдэр:",
      locc: "Байршил:",
      noActivity: "Идэвхилэл байхгүй байна",
      noActivityDesc:
        "Таны бүх үйлдлүүдийг (зар үүсгэх, засах, устгах, уршлах, холбогдох) энд харж болно",
      noMatches: "Тохирсон зар байхгүй байна",
      noMatchesDesc:
        "Та амьтнаа сайтад оруулахад тохирсон зарлалууд энд гарч ирнэ",
      created: "Үүсгэсэн",
      edited: "Засагдсан",
      deletedAct: "Устгасан",
      viewed: "Уршсан",
      contacted: "Холбогдсон",
      nerguiii: "Нэр мэдэгдэхгүй",
      contactOwner: "Эзэмшигчтэй холбогдох",
      contactMessage: "Мессеж",
      contactPhone: "Утасны дугаар",
      send: "Илгээх",
      sending: "Илгээж байна...",
      justnow: "Дөнгөж сая",
      viewMatch: "Тохирлыг үзэх",
    },
    en: {
      myProfile: "My Profile",
      memberSince: "Member since",
      totalPosts: "Total Posts",
      reunited: "Found",
      activePosts: "Lost",
      myPosts: "My Posts",
      activity: "Activity",
      matches: "Matches",
      settings: "Settings",
      edit: "Edit",
      delete: "Delete",
      contact: "Contact",
      viewDetails: "View Details",
      noPosts: "You don't have any posts",
      noPostsDesc: "Start by reporting a lost or found pet",
      createPost: "Create Post",
      lost: "Lost",
      found: "Found",
      dog: "Dog",
      cat: "Cat",
      personalInfo: "Personal Information",
      name: "Name",
      email: "Email",
      phone: "Phone",
      password: "Password",
      changePassword: "Change Password",
      notifications: "Notifications",
      emailNotif: "Email Notifications",
      emailNotifDesc: "Receive emails about new matches and messages",
      pushNotif: "Push Notifications",
      pushNotifDesc: "Show notifications in the app",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      accountSettings: "Account Settings",
      deleteAccount: "Delete Account",
      deleteAccountDesc: "All your data will be permanently deleted",
      deleteBtn: "Delete Account",
      loading: "Loading...",
      editPost: "Edit Post",
      petName: "Pet Name",
      petType: "Pet Type",
      breed: "Breed",
      description: "Description",
      location: "Location",
      status: "Status",
      deleteConfirm: "Are you sure you want to delete this post?",
      deleteWarning:
        "This action cannot be undone. The post will be permanently deleted.",
      confirmDelete: "Yes, Delete",
      saving: "Saving...",
      deleting: "Deleting...",
      editSuccess: "✓ Post updated successfully",
      deleteSuccess: "✓ Post deleted successfully",
      contactSuccess: "✓ Message sent to owner",
      editError: "Failed to update post",
      deleteError: "Failed to delete post",
      contactError: "Failed to contact owner",
      type: "Pet Type:",
      breedd: "Pet Breed:",
      locc: "Location:",
      noActivity: "No activity yet",
      noActivityDesc:
        "All your actions (create, edit, delete, view, contact) will appear here",
      noMatches: "No matches yet",
      noMatchesDesc:
        "When you create a listing, potential matches will appear here",
      created: "Created",
      edited: "Edited",
      deletedAct: "Deleted",
      viewed: "Viewed",
      contacted: "Contacted",
      nerguiii: "Unknown",
      contactOwner: "Contact Owner",
      contactMessage: "Message",
      contactPhone: "Phone Number",
      send: "Send",
      sending: "Sending...",
      justnow: "Just now",
      viewMatch: "View Match",
    },
  };

  const t = translations[language];

  // Get current user data
  const GetCurrentUser = async () => {
    if (!clerkUser?.id) return;

    try {
      const res = await fetch(`http://localhost:8000/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();

      const currentUser = data.find(
        (u: userType) => u.clerkId === clerkUser.id,
      );
      if (currentUser) {
        setUserData(currentUser);
        await GetUserPosts(currentUser._id);
      } else {
        setUserData(null);
      }
    } catch (err) {
      console.log("Error fetching user:", err);
      setLoading(false);
    }
  };

  // Get user's posts
  const GetUserPosts = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/lostFound`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
      const data = await res.json();
      const userPosts = data.filter((post: PostType) => post.userId === userId);
      setMyPosts(userPosts);

      // ✅ Get matched posts (opposite role)
      const matchedPosts = data.filter(
        (post: PostType) =>
          post.userId !== userId &&
          post.role !== (userPosts.length > 0 ? userPosts[0].role : "Lost"),
      );
      setMatchedPosts(matchedPosts.slice(0, 12)); // Limit to 12 for display
    } catch (err) {
      console.log("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load activities from localStorage
  const LoadActivities = (userId: string) => {
    const userActivities = ActivityService.getUserActivities(userId);
    setActivities(userActivities);
  };

  // Open Edit Modal
  const openEditModal = (post: PostType) => {
    setSelectedPost(post);
    setEditForm({
      name: post.name,
      breed: post.breed || "",
      petType: post.petType,
      description: post.description,
      role: post.role,
      location: post.location,
    });
    setEditModal(true);
  };

  // Open Contact Modal
  const openContactModal = (post: PostType) => {
    setSelectedPost(post);
    setContactForm({ message: "", phone: "" });
    setContactModal(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !userData) return;

    setIsSaving(true);

    try {
      const res = await fetch(
        `http://localhost:8000/lostFound/${selectedPost._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        },
      );

      if (res.ok) {
        const updatedPost = await res.json();
        const postData = updatedPost.data || updatedPost;
        setMyPosts(
          myPosts.map((post) =>
            post._id === selectedPost._id ? postData : post,
          ),
        );

        ActivityService.logActivity({
          userId: userData._id,
          timestamp: userData.role,
          action: "edited",
          postId: selectedPost._id,
          postName: editForm.name,
          postImage: selectedPost.image,
          details: `${editForm.petType} - ${editForm.location}`,
        });

        setEditModal(false);
        setSelectedPost(null);

        LoadActivities(userData._id);

        setSuccessMessage(t.editSuccess);
        setShowSuccess(true);
      } else {
        throw new Error("Failed to update");
      }
    } catch (err) {
      console.log("Error updating post:", err);
      alert(t.editError);
    } finally {
      setIsSaving(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (post: PostType) => {
    setSelectedPost(post);
    setDeleteModal(true);
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!selectedPost || !userData) return;

    setIsDeleting(true);

    try {
      const res = await fetch(
        `http://localhost:8000/lostFound/${selectedPost._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.ok) {
        const deletedPost = selectedPost;
        setMyPosts(myPosts.filter((post) => post._id !== selectedPost._id));

        ActivityService.logActivity({
          userId: userData._id,
          timestamp: userData.role,
          action: "deleted",
          postId: deletedPost._id,
          postName: deletedPost.name,
          postImage: deletedPost.image,
          details: `${deletedPost.petType} - ${deletedPost.location}`,
        });

        setDeleteModal(false);
        setSelectedPost(null);

        LoadActivities(userData._id);

        setSuccessMessage(t.deleteSuccess);
        setShowSuccess(true);
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      console.log("Error deleting post:", err);
      alert(t.deleteError);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Contact Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !userData) return;

    setIsSaving(true);

    try {
      ActivityService.logActivity({
        userId: userData._id,
        timestamp: userData.role,
        action: "contacted",
        postId: selectedPost._id,
        postName: selectedPost.name,
        postImage: selectedPost.image,
        details: `${selectedPost.petType} - ${selectedPost.location}`,
        targetUserId: selectedPost.userId,
        targetUserName: selectedPost.name,
      });

      setContactModal(false);
      setSelectedPost(null);

      LoadActivities(userData._id);

      setSuccessMessage(t.contactSuccess);
      setShowSuccess(true);
    } catch (err) {
      console.log("Error contacting owner:", err);
      alert(t.contactError);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle theme change
  const handleThemeChange = (newTheme: "auto" | "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("pawfinder_theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Format activity message
  const getActivityMessage = (action: string, postName: string) => {
    const actions = {
      created: `${t.created}`,
      edited: `${t.edited}`,
      deleted: `${t.deletedAct}`,
      viewed: `${t.viewed}`,
      contacted: `${t.contacted}`,
    };
    return `${actions[action as keyof typeof actions]} "${postName}"`;
  };

  // Format activity time
  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return `${t.justnow}`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get activity icon and color
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "created":
        return { icon: "✨", color: "bg-green-500" };
      case "edited":
        return { icon: <ActivityEdit />, color: "bg-primary" };
      case "deleted":
        return { icon: <DeleteIcon />, color: "bg-red-500" };
      case "viewed":
        return { icon: "👁️", color: "bg-purple-500" };
      case "contacted":
        return { icon: "💬", color: "bg-orange-500" };
      default:
        return { icon: "•", color: "bg-gray-500" };
    }
  };

  // Main initialization effect
  useEffect(() => {
    if (!clerkLoaded) {
      return;
    }

    const initProfile = async () => {
      try {
        if (!clerkUser?.id) {
          setLoading(false);
          return;
        }

        await GetCurrentUser();
      } catch (err) {
        console.log("Error initializing profile:", err);
        setLoading(false);
      }
    };

    initProfile();

    const savedTheme =
      (localStorage.getItem("pawfinder_theme") as "auto" | "light" | "dark") ||
      "auto";
    setTheme(savedTheme);
  }, [clerkLoaded, clerkUser?.id]);

  // Load activities when userData changes
  useEffect(() => {
    if (userData?._id) {
      LoadActivities(userData._id);
    }
  }, [userData]);

  const [activeTab, setActiveTab] = useState<
    "posts" | "matches" | "activity" | "settings"
  >("posts");

  const stats = {
    totalPosts: myPosts.length,
    reunited: myPosts.filter((post) => post.role === "Found").length,
    active: myPosts.filter((post) => post.role === "Lost").length,
  };

  if (!clerkLoaded || loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen py-12">
      <SuccessNotification
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        duration={3000}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-card-bg rounded-2xl border border-card-border p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <img
                src={
                  clerkUser?.imageUrl ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                }
                alt={userData?.name || "User"}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">
                {userData?.name || clerkUser?.fullName}
              </h1>
              <p className="text-muted mb-1">
                {userData?.email || clerkUser?.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-sm text-muted">
                {t.memberSince}{" "}
                {clerkUser?.createdAt
                  ? new Date(clerkUser.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats.totalPosts}
                </div>
                <div className="text-sm text-muted">{t.totalPosts}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {stats.reunited}
                </div>
                <div className="text-sm text-muted">{t.reunited}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {stats.active}
                </div>
                <div className="text-sm text-muted">{t.activePosts}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden">
          <div className="flex border-b border-card-border overflow-x-auto">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 px-4 sm:px-6 rounded-lg py-4 font-semibold cursor-pointer transition-all whitespace-nowrap ${
                activeTab === "posts"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-primary/10"
              }`}
            >
              {t.myPosts}
            </button>

            <button
              onClick={() => setActiveTab("matches")}
              className={`flex-1 px-4 sm:px-6 py-4 font-semibold cursor-pointer transition-all whitespace-nowrap ${
                activeTab === "matches"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-primary/10"
              }`}
            >
              {t.matches}
            </button>

            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 px-4 sm:px-6 py-4 font-semibold cursor-pointer transition-all whitespace-nowrap ${
                activeTab === "activity"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-primary/10"
              }`}
            >
              {t.activity}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 px-4 sm:px-6 py-4 font-semibold cursor-pointer transition-all whitespace-nowrap ${
                activeTab === "settings"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-primary/10"
              }`}
            >
              {t.settings}
            </button>
          </div>

          <div className="p-6">
            {activeTab === "posts" && (
              <div>
                {myPosts.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myPosts.map((post) => (
                      <div
                        key={post._id}
                        className="w-[320px] pet-card block bg-white dark:bg-card-bg rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100 ">
                          <img
                            src={post.image}
                            alt={post.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm text-white ${
                                post.role === "Lost"
                                  ? "status-lost"
                                  : "status-found"
                              }`}
                            >
                              {post.role === "Lost"
                                ? "🔍 " + t.lost
                                : "✓ " + t.found}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-4">
                          <h3 className="font-bold text-xl text-gray-900 dark:text-foreground leading-tight line-clamp-2">
                            {post?.name || t.nerguiii}
                          </h3>

                          <div className="space-y-2 text-sm">
                            <p className="text-muted">
                              <span className="font-semibold">{t.type}</span>
                              {post.petType}
                            </p>
                            {post.breed && (
                              <p className="text-muted">
                                <span className="font-semibold">
                                  {t.breedd}
                                </span>{" "}
                                {post.breed}
                              </p>
                            )}
                            <p className="text-muted flex gap-2">
                              <span className="font-semibold">{t.locc}</span>
                              {post.location.slice(0, 20)}...
                            </p>
                            <p className="text-muted line-clamp-2">
                              {post.description}
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => openEditModal(post)}
                              className="flex-1 cursor-pointer px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold text-sm transition-colors"
                            >
                              {t.edit}
                            </button>
                            <button
                              onClick={() => openDeleteModal(post)}
                              className="px-4 py-2.5 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors"
                            >
                              {t.delete}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold mb-2">{t.noPosts}</h3>
                    <p className="text-muted mb-6">{t.noPostsDesc}</p>
                    <Link
                      href="/report"
                      className="inline-block px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark"
                    >
                      {t.createPost}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "matches" && (
              <div>
                {matchedPosts.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matchedPosts.map((post) => (
                      <div
                        key={post._id}
                        className="w-[320px] pet-card block bg-white dark:bg-card-bg rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
                          <img
                            src={post.image}
                            alt={post.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm text-white ${
                                post.role === "Lost"
                                  ? "status-lost"
                                  : "status-found"
                              }`}
                            >
                              {post.role === "Lost"
                                ? "🔍 " + t.lost
                                : "✓ " + t.found}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-4">
                          <h3 className="font-bold text-xl text-gray-900 dark:text-foreground leading-tight line-clamp-2">
                            {post?.name || t.nerguiii}
                          </h3>

                          <div className="space-y-2 text-sm">
                            <p className="text-muted">
                              <span className="font-semibold">{t.type}</span>
                              {post.petType}
                            </p>
                            {post.breed && (
                              <p className="text-muted">
                                <span className="font-semibold">
                                  {t.breedd}
                                </span>{" "}
                                {post.breed}
                              </p>
                            )}
                            <p className="text-muted flex gap-2">
                              <span className="font-semibold">{t.locc}</span>
                              {post.location.slice(0, 20)}...
                            </p>
                            <p className="text-muted line-clamp-2">
                              {post.description}
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => router.push(`/pet/${post._id}`)}
                              className="flex-1 cursor-pointer px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold text-sm transition-colors"
                            >
                              {t.viewMatch}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold mb-2">{t.noMatches}</h3>
                    <p className="text-muted mb-6">{t.noMatchesDesc}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div>
                {activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => {
                      const { icon, color } = getActivityIcon(activity.action);
                      return (
                        <div
                          key={activity._id}
                          className="flex items-center gap-4 p-4 border border-card-border rounded-xl hover:bg-primary/5 transition-colors"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-700">
                            <img
                              src={
                                activity.postImage ||
                                "https://via.placeholder.com/64"
                              }
                              alt={activity.postName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 items-center">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{icon}</span>
                              <p className="font-semibold text-sm text-gray-900 dark:text-foreground">
                                {getActivityMessage(
                                  activity.action,
                                  activity.postName,
                                )}
                              </p>
                            </div>

                            <p className="text-xs text-muted mb-2">
                              {activity.details}
                            </p>

                            <p className="text-xs text-muted">
                              {formatActivityTime(activity.timestamp)}
                            </p>
                          </div>

                          <div
                            className={`shrink-0 w-[8%] h-10 rounded-xl text-xs flex justify-center items-center font-semibold text-white whitespace-nowrap ${color}`}
                          >
                            {activity.action === "created"
                              ? t.created
                              : activity.action === "edited"
                                ? t.edited
                                : activity.action === "deleted"
                                  ? t.deletedAct || "Unknown"
                                  : activity.action === "viewed"
                                    ? t.viewed
                                    : t.contacted}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-bold mb-2">{t.noActivity}</h3>
                    <p className="text-muted mb-6">{t.noActivityDesc}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="flex flex-col justify-center">
                <div className="space-y-8 max-w-4xl">
                  {/* Personal Information */}
                  <div className="bg-background rounded-xl p-6 border border-card-border">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="text-2xl">👤</span>
                      {language === "mn"
                        ? "Хувийн мэдээлэл"
                        : "Personal Information"}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t.name}
                        </label>
                        <input
                          type="text"
                          defaultValue={userData?.name || ""}
                          className="w-full px-4 py-3 bg-white dark:bg-card-bg border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          placeholder={
                            language === "mn"
                              ? "Нэрээ оруулна уу"
                              : "Enter your name"
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t.email}
                        </label>
                        <input
                          type="email"
                          defaultValue={userData?.email || ""}
                          className="w-full px-4 py-3 bg-white dark:bg-card-bg border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t.phone}
                        </label>
                        <input
                          type="tel"
                          defaultValue={userData?.phonenumber || ""}
                          className="w-full px-4 py-3 bg-white dark:bg-card-bg border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          placeholder="+976 XXXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {language === "mn" ? "Хүйс" : "Gender"}
                        </label>
                        <select className="w-full px-4 py-3 bg-white dark:bg-card-bg border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer">
                          <option value="">
                            {language === "mn" ? "Сонго" : "Select"}
                          </option>
                          <option value="male">
                            {language === "mn" ? "Эрэгтэй" : "Male"}
                          </option>
                          <option value="female">
                            {language === "mn" ? "Эмэгтэй" : "Female"}
                          </option>
                          <option value="other">
                            {language === "mn" ? "Бусад" : "Other"}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Password & Security */}
                  <div className="bg-background rounded-xl p-6 border border-card-border">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="text-2xl">🔒</span>
                      {language === "mn" ? "Аюулгүй байдал" : "Security"}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t.password}
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="password"
                            className="flex-1 px-4 py-3 bg-white dark:bg-card-bg border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder="••••••••"
                            disabled
                          />
                          <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-all">
                            {t.changePassword}
                          </button>
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {language === "mn"
                            ? "Нууц үг өөрчлөх үед нэмэлт аюулгүй байдлын шалгалт хийгдэнэ"
                            : "You'll need to verify your email to change your password"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div className="bg-background rounded-xl p-6 border border-card-border">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="text-2xl">🔔</span>
                      {t.notifications}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-card-bg rounded-lg border border-card-border hover:border-primary transition-all">
                        <div className="flex-1">
                          <div className="font-semibold">{t.emailNotif}</div>
                          <div className="text-sm text-muted">
                            {t.emailNotifDesc}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white dark:bg-card-bg rounded-lg border border-card-border hover:border-primary transition-all">
                        <div className="flex-1">
                          <div className="font-semibold">{t.pushNotif}</div>
                          <div className="text-sm text-muted">
                            {t.pushNotifDesc}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white dark:bg-card-bg rounded-lg border border-card-border hover:border-primary transition-all">
                        <div className="flex-1">
                          <div className="font-semibold">
                            {language === "mn"
                              ? "Тохирсон мэдэгдэл"
                              : "Match Notifications"}
                          </div>
                          <div className="text-sm text-muted">
                            {language === "mn"
                              ? "Амьтан олдоход мэдэгдэл авах"
                              : "Get notified when a match is found"}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white dark:bg-card-bg rounded-lg border border-card-border hover:border-primary transition-all">
                        <div className="flex-1">
                          <div className="font-semibold">
                            {language === "mn"
                              ? "Мессеж мэдэгдэл"
                              : "Message Notifications"}
                          </div>
                          <div className="text-sm text-muted">
                            {language === "mn"
                              ? "Шинэ мессеж ирэхэд мэдэгдэл авах"
                              : "Get notified about new messages"}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-background rounded-xl p-6 border border-card-border">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="text-2xl">🔐</span>
                      {language === "mn"
                        ? "Нууцлалын тохиргоо"
                        : "Privacy Settings"}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-card-bg rounded-lg border border-card-border hover:border-primary transition-all">
                        <div className="flex-1">
                          <div className="font-semibold">
                            {language === "mn"
                              ? "Нээлттэй профайл"
                              : "Public Profile"}
                          </div>
                          <div className="text-sm text-muted">
                            {language === "mn"
                              ? "Бусад хэрэглэгчид таны профайлыг харж болно"
                              : "Other users can view your profile"}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white dark:bg-card-bg rounded-lg border border-card-border hover:border-primary transition-all">
                        <div className="flex-1">
                          <div className="font-semibold">
                            {language === "mn"
                              ? "Байршилыг харуулах"
                              : "Show Location"}
                          </div>
                          <div className="text-sm text-muted">
                            {language === "mn"
                              ? "Таны байршилыг бусад ашигладаг харж болно"
                              : "Allow users to see your location"}
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* App Preferences */}
                  <div className="bg-background rounded-xl p-6 border border-card-border">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="text-2xl">⚙️</span>
                      {language === "mn"
                        ? "Аппликэйшн сонголт"
                        : "App Preferences"}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {language === "mn"
                            ? "Үзүүлэх хэл"
                            : "Display Language"}
                        </label>
                        <select
                          value={language}
                          onChange={(e) => {
                            if (e.target.value !== language) {
                              toggleLanguage();
                            }
                          }}
                          className="w-full px-4 py-3 bg-white dark:bg-card-bg border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                        >
                          <option value="mn">
                            {language === "mn" ? "Монгол" : "Mongolian"}
                          </option>
                          <option value="en">
                            {language === "mn" ? "Англи" : "English"}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {language === "mn" ? "Өнгөний схем" : "Color Theme"}
                        </label>
                        <select
                          value={theme}
                          onChange={(e) =>
                            handleThemeChange(
                              e.target.value as "auto" | "light" | "dark",
                            )
                          }
                          className="w-full px-4 py-3 bg-white dark:bg-card-bg border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                        >
                          <option value="auto">
                            {language === "mn" ? "🔄 Автомат" : "🔄 Auto"}
                          </option>
                          <option value="light">
                            {language === "mn" ? "☀️ Цагаан" : "☀️ Light"}
                          </option>
                          <option value="dark">
                            {language === "mn" ? "🌙 Хар" : "🌙 Dark"}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-2">
                      <span>💾</span>
                      {t.saveChanges}
                    </button>
                    <button className="flex-1 px-8 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                      <span>↩️</span>
                      {t.cancel}
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="border-t-2 border-red-200 dark:border-red-800 pt-8">
                    <h3 className="text-xl font-bold mb-6 text-red-600 dark:text-red-400 flex items-center gap-2">
                      <span className="text-2xl">⚠️</span>
                      {language === "mn" ? "Опасан үйлдлүүд" : "Danger Zone"}
                    </h3>

                    <div className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                            {t.deleteAccount}
                          </div>
                          <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
                            {t.deleteAccountDesc}
                          </p>
                          <ul className="text-sm text-red-600/80 dark:text-red-400/80 list-disc list-inside space-y-1">
                            <li>
                              {language === "mn"
                                ? "Бүх зарлалуудаа устах болно"
                                : "All your posts will be deleted"}
                            </li>
                            <li>
                              {language === "mn"
                                ? "Бүх мессеж устах болно"
                                : "All messages will be erased"}
                            </li>
                            <li>
                              {language === "mn"
                                ? "Энэ үйлдлийг буцаах боломжгүй"
                                : "This action cannot be undone"}
                            </li>
                          </ul>
                        </div>
                        <button className="ml-4 px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all whitespace-nowrap shrink-0">
                          {t.deleteBtn}
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-muted mb-3 font-semibold">
                        {language === "mn"
                          ? "📊 Акаунтын мэдээлэл"
                          : "📊 Account Information"}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                          <p className="text-muted text-xs mb-1">
                            {language === "mn" ? "📅 Үүссэн" : "📅 Created"}
                          </p>
                          <p className="font-semibold">
                            {clerkUser?.createdAt
                              ? new Date(
                                  clerkUser.createdAt,
                                ).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                          <p className="text-muted text-xs mb-1">
                            {language === "mn"
                              ? "📝 Нийт зар"
                              : "📝 Total Posts"}
                          </p>
                          <p className="font-semibold">{stats.totalPosts}</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                          <p className="text-muted text-xs mb-1">
                            {language === "mn"
                              ? "⚡ Идэвхилэл"
                              : "⚡ Activities"}
                          </p>
                          <p className="font-semibold">{activities.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-card-bg rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-card-border sticky top-0">
              <h2 className="text-2xl font-bold">{t.editPost}</h2>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.petName}
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.petType}
                </label>
                <select
                  value={editForm.petType}
                  onChange={(e) =>
                    setEditForm({ ...editForm, petType: e.target.value })
                  }
                  className="w-full cursor-pointer px-4 py-2 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  required
                >
                  <option value="Dog">{t.dog}</option>
                  <option value="Cat">{t.cat}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.breed}
                </label>
                <input
                  type="text"
                  value={editForm.breed}
                  onChange={(e) =>
                    setEditForm({ ...editForm, breed: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.status}
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      role: e.target.value as "Lost" | "Found",
                    })
                  }
                  className="w-full px-4 cursor-pointer py-2 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Lost">{t.lost}</option>
                  <option value="Found">{t.found}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.location}
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.description}
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-background border border-card-border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isSaving ? t.saving : t.saveChanges}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditModal(false);
                    setSelectedPost(null);
                  }}
                  disabled={isSaving}
                  className="flex-1 cursor-pointer px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-60 transition-all"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-card-bg rounded-2xl max-w-md w-full p-6 text-center">
            <h3 className="text-xl font-bold mb-4">{t.deleteConfirm}</h3>
            <p className="text-muted mb-6 text-sm">{t.deleteWarning}</p>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 text-left">
                  <p className="font-semibold">{selectedPost.name}</p>
                  <p className="text-sm text-muted">{selectedPost.petType}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setSelectedPost(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-6 py-2 cursor-pointer bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-60 transition-all"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-6 py-2 cursor-pointer bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-60 transition-all"
              >
                {isDeleting ? t.deleting : t.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
    </div>
  );
}
