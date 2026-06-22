export default function NearbyVolunteers({ volunteers }: any) {
  if (!volunteers || volunteers.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        🚨 Yakındaki Gönüllüler
      </h2>

      <div className="space-y-3">
        {volunteers.map((volunteer: any) => (
          <div
            key={volunteer.id}
            className="p-4 rounded-xl bg-orange-50 flex justify-between"
          >
            <span>{volunteer.name}</span>

            <span>
              {typeof volunteer.distance === "number"
                ? `${volunteer.distance.toFixed(2)} km`
                : "Hazır"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}