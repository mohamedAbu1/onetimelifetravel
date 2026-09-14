"use client";
import EmojiPicker from "emoji-picker-react";

export default function ReviewForm({
  comment,
  setComment,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
  onSubmit,
  placeholder,
  submitLabel,
  theme,
}) {
  return (
    <form onSubmit={onSubmit} className="trip-review-form space-y-4">
      <div className="flex items-start gap-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-4 rounded-2xl focus:outline-none ${theme.border} ${theme.text}`}
          rows={3}
        />

        <button
          type="button"
          style={{ cursor: "pointer" }}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Add emoji"
          className={`mt-1 px-3 py-3 rounded-xl transition ${theme.buttonSecondary}`}
        >
          😀
        </button>
        {showEmojiPicker && (
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme={theme.name === "dark" ? "dark" : "light"}
          />
        )}
      </div>

      <button
        type="submit"
        style={{ cursor: "pointer" }}
        className={`px-6 py-3 rounded-full font-semibold transition ${theme.buttonPrimary}`}
      >
        {submitLabel}
      </button>
    </form>
  );
}
