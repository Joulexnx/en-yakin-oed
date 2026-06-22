export default function VolunteerModal({
  show,
  onClose,
  volunteerName,
  setVolunteerName,
  registerVolunteer,
}: any) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-600">
            ❤️ Gönüllü Ol
          </h2>

          <button onClick={onClose} className="text-2xl font-bold">
            ✕
          </button>
        </div>

        <input
          className="border p-3 rounded-xl w-full"
          placeholder="Ad Soyad"
          value={volunteerName}
          onChange={(e) => setVolunteerName(e.target.value)}
        />

        <button
          onClick={registerVolunteer}
          className="mt-4 w-full bg-red-600 text-white py-3 rounded-xl font-bold"
        >
          Kaydol
        </button>
      </div>
    </div>
  );
}