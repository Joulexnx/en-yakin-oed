export default function TYDModal({ show, onClose }: any) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-600">
            🚑 TYD Rehberi
          </h2>

          <button onClick={onClose} className="text-2xl font-bold">
            ✕
          </button>
        </div>

        <div className="space-y-3 text-gray-700">
          <div className="p-3 rounded-xl bg-gray-50">1️⃣ Çevre güvenliği</div>
          <div className="p-3 rounded-xl bg-gray-50">2️⃣ Bilinç kontrolü</div>
          <div className="p-3 rounded-xl bg-red-50 font-semibold text-red-600">
            3️⃣ 112 ara + OED getir
          </div>
          <div className="p-3 rounded-xl bg-green-50 font-bold">7️⃣ 30 bası</div>
          <div className="p-3 rounded-xl bg-green-50 font-bold">8️⃣ 2 nefes</div>
          <div className="p-3 rounded-xl bg-blue-50 font-bold">9️⃣ OED bağla</div>
        </div>
      </div>
    </div>
  );
}