function AITypingIndicator() {
  return <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-sm w-fit">
      <span className="text-sm text-gray-600">AI is thinking</span>
      <div className="typing-indicator">
        <span />
        <span />
        <span />
      </div>
    </div>;
}
export {
  AITypingIndicator
};
