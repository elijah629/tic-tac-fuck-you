export default function SimpleDropZone() {
  return (
    <div
      data-drop-zone
      className="w-32 h-32 border-4 border-dashed border-red-500 rounded-lg flex items-center justify-center transition-all duration-200"
    >
      <div className="text-center">
        <div className="text-red-400 font-semibold text-sm mb-1">Drop Zone</div>
        <div className="text-red-300 text-xs">Drop here to remove</div>
      </div>
    </div>
  );
}
