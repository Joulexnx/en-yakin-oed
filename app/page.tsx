"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { oeds } from "./data/oeds";
import { getDistance } from "../lib/distance";


const AEDMap = dynamic(() => import("../components/AEDMap"), {
  ssr: false,
});

export default function Home() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [nearestOed, setNearestOed] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showTYD, setShowTYD] = useState(false);

  const getLocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        const nearest = oeds
          .map((oed) => ({
            ...oed,
            distance: getDistance(lat, lng, oed.lat, oed.lng),
          }))
          .sort((a, b) => a.distance - b.distance)[0];

        setNearestOed(nearest);
        setLoading(false);
      },
      () => {
        alert("Konum alınamadı");
        setLoading(false);
      }
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-rose-500 p-8 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white,_transparent_40%)]"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              🚑 En Yakın OED
            </h1>

            

            <p className="mt-3 text-red-100 text-lg">
              Ani kalp durmasında en yakın şok cihazını saniyeler içinde bulun
            </p>

            <div className="mt-5 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm">
              ⚠️ Acil durumda önce 112’yi arayın
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <p className="text-gray-500 text-sm">Toplam OED</p>
            <p className="text-3xl font-bold text-red-600">{oeds.length}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5">
            <p className="text-gray-500 text-sm">En Yakın</p>
            <p className="text-2xl font-bold">
              {nearestOed ? `${nearestOed.distance.toFixed(2)} km` : "-"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5">
            <p className="text-gray-500 text-sm">Yürüyüş</p>
            <p className="text-2xl font-bold text-green-600">
              {nearestOed
                ? `${(nearestOed.distance * 12).toFixed(0)} dk`
                : "-"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5">
            <p className="text-gray-500 text-sm">Durum</p>
            <p className="text-xl font-bold text-green-600">Hazır</p>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={getLocation}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 transition-all text-white py-5 rounded-2xl text-lg font-semibold shadow-xl"
        >
          {loading ? "Konum Alınıyor..." : "📍 Konumumu Kullan"}
        </button>

        {/* CARD */}
        {nearestOed && (
          <div className="mt-6 bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  En Yakın OED
                </h2>

                <p className="mt-2 text-lg font-medium text-gray-700">
                  📍 {nearestOed.name}
                </p>

                <p className="text-gray-500">
                  İlçe: {nearestOed.district}
                </p>

                <p className="mt-2 font-semibold text-green-600">
                  Mesafe: {nearestOed.distance.toFixed(2)} km
                </p>

                <p className="text-gray-600">
                  Yürüyüş: {(nearestOed.distance * 12).toFixed(0)} dk
                </p>
              </div>

              <a
                href="tel:112"
                className="bg-red-600 hover:bg-red-700 transition text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
              >
                🚨 112 Ara
              </a>
            </div>
          </div>
        )}

        {/* MAP */}
        <div className="mt-6 rounded-3xl overflow-hidden shadow-2xl border border-white w-full">
          {latitude && longitude ? (
            <AEDMap
              latitude={latitude}
              longitude={longitude}
              oeds={oeds}
              nearestOed={nearestOed}
            />
          ) : (
            <div className="h-[550px] bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center">
              <p className="text-xl font-semibold text-gray-700">
                Konum bekleniyor...
              </p>

              <p className="text-gray-500 mt-2">
                Haritayı görmek için konum izni verin
              </p>
            </div>
          )}
        </div>

        {/* LEGEND */}
        <div className="mt-4 bg-white rounded-2xl shadow-lg p-4 flex flex-wrap gap-6 justify-center">
          <div>🔵 Kullanıcı</div>
          <div>🔴 OED</div>
          <div>🟢 En Yakın OED</div>
        </div>

        {/* EMERGENCY BAR */}
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999]">
          <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-3 flex gap-3 border">
            <a
              href="tel:112"
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              🚨 112
            </a>

            <button
  onClick={() => setShowTYD(true)}
  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
>
  ❤️ TYD Rehberi

  
</button>
          </div>
        </div>
      </div>

      {showTYD && (
  <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center p-4">
    <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-red-600">
          🚑 TYD Rehberi
        </h2>

        <button
          onClick={() => setShowTYD(false)}
          className="text-2xl font-bold"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-gray-700">
        <div className="p-3 rounded-xl bg-gray-50">1️⃣ Çevre güvenliği</div>
        <div className="p-3 rounded-xl bg-gray-50">2️⃣ Bilinç kontrolü</div>
        <div className="p-3 rounded-xl bg-red-50 font-semibold text-red-600">
          3️⃣ 112 ara + OED getir
        </div>
        <div className="p-3 rounded-xl bg-gray-50">4️⃣ Ağız içini kontrol et</div>
        <div className="p-3 rounded-xl bg-gray-50">5️⃣ Baş-çene pozisyonu ver</div>
        <div className="p-3 rounded-xl bg-yellow-50">
          6️⃣ Solunumu kontrol et (10 sn)
        </div>
        <div className="p-3 rounded-xl bg-green-50 font-bold">
          7️⃣ 30 kalp masajı
        </div>
        <div className="p-3 rounded-xl bg-green-50 font-bold">
          8️⃣ 2 kurtarıcı nefes
        </div>
        <div className="p-3 rounded-xl bg-blue-50 font-bold">
          9️⃣ OED bağla
        </div>
      </div>
    </div>
  </div>
)}
    </main>
    
  );
}