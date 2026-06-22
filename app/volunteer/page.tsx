"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function VolunteerPage() {
  const [name, setName] = useState("");

  const registerVolunteer = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { error } = await supabase.from("volunteers").insert({
        name,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        certified: true,
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Gönüllü kaydı başarılı");
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4">Gönüllü Ol</h1>

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