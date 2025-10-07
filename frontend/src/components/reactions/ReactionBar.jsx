import { useState, useRef, useMemo } from "react";

export default function ReactionBar({
  itemId,
  currentUser,
  userReaction,
  setUserReaction,
  reactions = {},
  setReactions,
  onReact,
}) {
  const [showEmojis, setShowEmojis] = useState(false);
  const hoverTimeout = useRef(null);

  const REACTION_TYPES = [
    { type: "like", emoji: "👍", label: "Like" },
    { type: "love", emoji: "❤️", label: "Love" },
    { type: "haha", emoji: "😂", label: "Haha" },
    { type: "wow", emoji: "😮", label: "Wow" },
    { type: "sad", emoji: "😢", label: "Sad" },
    { type: "angry", emoji: "😡", label: "Angry" },
  ];

  const totalReactions = useMemo(
    () => Object.values(reactions).reduce((sum, n) => sum + n, 0),
    [reactions]
  );

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    setShowEmojis(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setShowEmojis(false), 200);
  };

  const handleClick = async (type) => {
  if (!currentUser) return alert("Please log in to react.");
  
  const isRemoving = userReaction === type;
  
  // Optimistic update
  const updatedCounts = { ...reactions };
  
  // Remove old reaction count
  if (userReaction && updatedCounts[userReaction] > 0) {
    updatedCounts[userReaction]--;
  }
  
  // Add new reaction count (if not removing)
  if (!isRemoving) {
    updatedCounts[type] = (updatedCounts[type] || 0) + 1;
  }

  // Update UI immediately
  setReactions(updatedCounts);
  setUserReaction(isRemoving ? null : type);

  // Send to server
  try {
    const response = await onReact(type);
    // Update with server response to ensure accuracy
    if (response && (response.counts || response.reaction_counts)) {
      setReactions(response.counts || response.reaction_counts);
      setUserReaction(response.user_reaction);
    }
  } catch (error) {
    console.error('Reaction failed:', error);
    // Revert on error
    setReactions(reactions);
    setUserReaction(userReaction);
    alert('Failed to update reaction. Please try again.');
  }
};

  return (
    <div
      className="relative inline-block select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main button with total count */}
      <button
        className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition-colors ${
          userReaction
            ? "bg-blue-600 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        }`}
      >
        <span>👍</span>
        <span>{totalReactions >= 0 ? totalReactions : ""}</span>
      </button>

      {/* Hover popup: all reaction types + counts */}
      {showEmojis && (
        <div className="absolute -top-14 left-1/2 -translate-x-4/5 bg-white dark:bg-slate-700 shadow-lg rounded-full px-3 py-2 flex gap-3 z-50 transition-all duration-200 reaction-popup">
          {REACTION_TYPES.map((reaction) => (
            <button
              key={reaction.type}
              onClick={() => handleClick(reaction.type)}
              className={`flex flex-col items-center text-xl font-semibold ${
                userReaction === reaction.type ? "scale-110 bg-gray-200 dark:bg-slate-500 rounded-full" : ""
              } hover:scale-125 transition-transform`}
              title={reaction.label}
            >
              <span>{reaction.emoji}</span>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {reactions[reaction.type] || 0}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
