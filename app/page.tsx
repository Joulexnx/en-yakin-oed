"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { oeds } from "./data/oeds";
import { getDistance } from "../lib/distance";
import TYDModal from "../components/TYDModal";
import VolunteerModal from "../components/VolunteerModal";
import NearbyVolunteers from "../components/NearbyVolunteers";
import { supabase } from "../lib/supabase";
import OneSignal from "react-onesignal";

const AEDMap = dynamic(() => import("../components/AEDMap"), {
  ssr: false,
});

export default function Home() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [nearestOed, setNearestOed] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [showTYD, setShowTYD] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);

  const [volunteerName, setVolunteerName] = useState("");
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [nearbyVolunteers, setNearbyVolunteers] = useState<any[]>([]);
  const [playerId, setPlayerId] = useState("");

  const loadVolunteers = async () => {
    const { data, error } = await supabase
      .from("volunteers")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setVolunteers(data || []);
  };

  const startLiveTracking = () => {
    const volunteerId = localStorage.getItem("volunteer_id");
    if (!volunteerId) return null;

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        await supabase
          .from("volunteers")
          .update({
            lat,
            lng,
            updated_at: new Date().toISOString(),
          })
          .eq("id", volunteerId);
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return id;
  };

useEffect(() => {
  async function initOneSignal() {
    try {
      console.log("ONESIGNAL INIT BAŞLADI");

      await OneSignal.init({
        appId: "3628049c-37d2-483e-afe9-f6eafae5761a",
        allowLocalhostAsSecureOrigin: true,
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        serviceWorkerUpdaterPath: "/OneSignalSDKUpdaterWorker.js",
      });

      console.log("ONESIGNAL INIT TAMAM");

      await OneSignal.Notifications.requestPermission();

      setTimeout(() => {
        const sub = OneSignal.User.PushSubscription;

        console.log("SUB:", sub);

        if (sub?.id) {
          console.log("PLAYER ID:", sub.id);
          setPlayerId(sub.id);
        }
      }, 5000);
    } catch (error) {
      console.log("ONESIGNAL ERROR:", error);
    }
  }

  initOneSignal();
  loadVolunteers();

  let geoWatchId: number | null = null;
  const volunteerId = localStorage.getItem("volunteer_id");

  if (volunteerId) {
    geoWatchId = startLiveTracking();
  }

  const interval = setInterval(() => {
    loadVolunteers();
  }, 10000);

  return () => {
    clearInterval(interval);

    if (geoWatchId !== null) {
      navigator.geolocation.clearWatch(geoWatchId);
    }
  };
}, []);

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

  const registerVolunteer = async () => {
  console.log("REGISTER PLAYER ID:", playerId);

  if (!playerId) {
    alert("Bildirim sistemi henüz hazır değil. 5-10 saniye bekle.");
    return;
  }

  if (!volunteerName) return alert("Ad gir");
  if (!latitude || !longitude) return alert("Önce konum al");

    const { data, error } = await supabase
      .from("volunteers")
      .insert({
        name: volunteerName,
        lat: latitude,
        lng: longitude,
        certified: true,
        player_id: playerId,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    localStorage.setItem("volunteer_id", String(data.id));
    startLiveTracking();

    setVolunteerName("");
    setShowVolunteerModal(false);
    await loadVolunteers();

    alert("Gönüllü kaydedildi");
  };

  const emergencyCall = () => {
    if (!latitude || !longitude) return alert("Önce konum alın");

    const nearby = volunteers
      .map((v) => ({
        ...v,
        distance: getDistance(latitude, longitude, v.lat, v.lng),
      }))
      .filter((v) => v.distance < 5)
      .sort((a, b) => a.distance - b.distance);

    setNearbyVolunteers(nearby);

    if (nearby.length === 0) {
      alert("Yakında gönüllü bulunamadı");
    } else {
      alert(`${nearby.length} gönüllüye bildirim gönderildi`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-rose-500 p-8 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            🚑 En Yakın OED
          </h1>

          <p className="mt-3 text-red-100 text-lg">
            Ani kalp durmasında en yakın şok cihazını saniyeler içinde bulun
          </p>

          <div className="mt-5 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm">
            ⚠️ Acil durumda önce 112’yi arayın
          </div>
        </div>

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
              {nearestOed ? `${(nearestOed.distance * 12).toFixed(0)} dk` : "-"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5">
            <p className="text-gray-500 text-sm">Durum</p>
            <p className="text-xl font-bold text-green-600">Hazır</p>
          </div>
        </div>

        <button
          onClick={getLocation}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl text-lg font-semibold shadow-xl"
        >
          {loading ? "Konum Alınıyor..." : "📍 Konumumu Kullan"}
        </button>

        <button
          onClick={() => setShowVolunteerModal(true)}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold"
        >
          ❤️ Gönüllü Ol
        </button>

        {nearestOed && (
          <div className="mt-6 bg-white rounded-3xl shadow-xl p-6">
            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold">En Yakın OED</h2>

                <p className="mt-2 text-lg font-medium">
                  📍 {nearestOed.name}
                </p>

                <p className="text-gray-500">
                  İlçe: {nearestOed.district}
                </p>

                <p className="mt-2 text-green-600 font-bold">
                  Mesafe: {nearestOed.distance.toFixed(2)} km
                </p>
              </div>

              <div className="flex flex-col gap-3 min-w-[220px]">
                <a
                  href={`https://www.google.com/maps/dir/${latitude},${longitude}/${nearestOed.lat},${nearestOed.lng}`}
                  target="_blank"
                  className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-4 rounded-2xl font-bold shadow-lg text-center"
                >
                  🧭 Yol Tarifi
                </a>

                <button
                  onClick={emergencyCall}
                  className="bg-orange-500 hover:bg-orange-600 transition text-black px-8 py-4 rounded-2xl font-bold shadow-lg text-center w-full"
                >
                  🚨 Acil Çağrı
                </button>

                <a
                  href="tel:112"
                  className="bg-red-600 hover:bg-red-700 transition text-white px-8 py-4 rounded-2xl font-bold shadow-lg text-center"
                >
                  🚑 112 Ara
                </a>
              </div>
            </div>
          </div>
        )}

        {nearbyVolunteers.length > 0 && (
          <NearbyVolunteers volunteers={nearbyVolunteers} />
        )}

        <div className="mt-6 rounded-3xl overflow-hidden shadow-2xl border border-white w-full">
          {latitude && longitude ? (
            <AEDMap
              latitude={latitude}
              longitude={longitude}
              oeds={oeds}
              nearestOed={nearestOed}
              volunteers={volunteers}
            />
          ) : (
            <div className="h-[550px] bg-gray-300 flex items-center justify-center">
              Konum bekleniyor...
            </div>
          )}
        </div>

        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999]">
          <div className="bg-white shadow-2xl rounded-2xl p-3 flex gap-3 border">
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
              ❤️ TYD
            </button>
          </div>
        </div>
      </div>

      <TYDModal show={showTYD} onClose={() => setShowTYD(false)} />

      <VolunteerModal
        show={showVolunteerModal}
        onClose={() => setShowVolunteerModal(false)}
        volunteerName={volunteerName}
        setVolunteerName={setVolunteerName}
        registerVolunteer={registerVolunteer}
      />
    </main>
  );
}