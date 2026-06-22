"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function VolunteerPage() {
  const [name, setName] = useState("");

  const registerVolunteer = async () => {
    alert("CLICK WORKED");

    if (!name) {
      alert("Ad gir");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation yok");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        alert("Konum alındı");

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const { error } = await supabase
          .from("volunteers")
          .insert({
            name: name,
            lat: latitude,
            lng: longitude,
            certified: true,
          });

        console.log("ERROR:", error);

        if (error) {
          alert("Supabase hata: " + error.message);
        } else {
          alert("Başarılı kayıt!");
        }
      },
      (error) => {
        alert("Konum hatası: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-4 text-center">Gönüllü Ol</h1>

        <input
          className="border p-3 rounded-xl w-full"
          placeholder="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={registerVolunteer}
          className="mt-4 w-full bg-red-600 text-white py-3 rounded-xl"
        >
          Kayıt Ol
        </button>
      </div>
    </main>
  );
}