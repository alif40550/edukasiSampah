'use client';

import { useState } from 'react';

export default function CalculatorSection() {
  const [habits, setHabits] = useState({
    tumbler: true,
    bag: true,
    cutlery: false,
    compost: false,
  });

  const toggleHabit = (key) => {
    setHabits((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculations
  let weeklyPlastic = 0;
  let weeklyCarbon = 0;

  if (habits.tumbler) {
    weeklyPlastic += 0.15;
    weeklyCarbon += 0.08;
  }
  if (habits.bag) {
    weeklyPlastic += 0.12;
    weeklyCarbon += 0.06;
  }
  if (habits.cutlery) {
    weeklyPlastic += 0.08;
    weeklyCarbon += 0.04;
  }
  if (habits.compost) {
    weeklyCarbon += 0.15;
  }

  const annualPlastic = (weeklyPlastic * 52).toFixed(1);
  const annualCarbon = (weeklyCarbon * 52).toFixed(1);
  const annualTrees = Math.max(0.1, weeklyCarbon * 52 / 10).toFixed(1);

  return (
    <section id="kalkulator-dampak" className="section calc-section">
      <div className="container">
        <div className="calc-box">
          <div className="calc-header">
            <span className="badge-pill">Dashboard Simulasi Interaktif</span>
            <h2>Kalkulator Pencegahan Sampah Anda</h2>
            <p>Pilih kebiasaan ramah lingkungan yang Anda lakukan setiap minggu untuk melihat kontribusi nyata bagi kebersihan lingkungan:</p>
          </div>

          <div className="calc-body">
            <div className="calc-habits">
              <label className="calc-item">
                <input
                  type="checkbox"
                  checked={habits.tumbler}
                  onChange={() => toggleHabit('tumbler')}
                />
                <span className="checkmark"></span>
                <div className="calc-item__desc">
                  <strong>Membawa Tumbler & Botol Minum Sendiri</strong>
                  <p>Mencegah pembuangan 3-5 botol kemasan plastik sekali pakai per minggu.</p>
                </div>
              </label>

              <label className="calc-item">
                <input
                  type="checkbox"
                  checked={habits.bag}
                  onChange={() => toggleHabit('bag')}
                />
                <span className="checkmark"></span>
                <div className="calc-item__desc">
                  <strong>Membawa Tas Belanja Ramah Lingkungan (Tote Bag)</strong>
                  <p>Mengurangi ketergantungan pada kantong kresek di pasar dan toko oleh-oleh.</p>
                </div>
              </label>

              <label className="calc-item">
                <input
                  type="checkbox"
                  checked={habits.cutlery}
                  onChange={() => toggleHabit('cutlery')}
                />
                <span className="checkmark"></span>
                <div className="calc-item__desc">
                  <strong>Membawa Sendok & Sedotan Reusable</strong>
                  <p>Menghindari limbah sendok dan sedotan plastik yang sulit terurai di alam.</p>
                </div>
              </label>

              <label className="calc-item">
                <input
                  type="checkbox"
                  checked={habits.compost}
                  onChange={() => toggleHabit('compost')}
                />
                <span className="checkmark"></span>
                <div className="calc-item__desc">
                  <strong>Memilah Sampah Organik untuk Kompos Rumah / Kebun</strong>
                  <p>Mencegah pelepasan gas metana dari tumpukan sampah basah di TPA.</p>
                </div>
              </label>
            </div>

            <div className="calc-result">
              <h3>Estimasi Dampak 1 Tahun</h3>
              <div className="result-cards">
                <div className="res-card">
                  <div className="res-card__value">{annualPlastic} kg</div>
                  <div className="res-card__label">Sampah Plastik Tercegah</div>
                </div>
                <div className="res-card">
                  <div className="res-card__value">{annualCarbon} kg</div>
                  <div className="res-card__label">Emisi CO2 Berkurang</div>
                </div>
                <div className="res-card res-card--highlight">
                  <div className="res-card__value">
                    {weeklyPlastic === 0 && weeklyCarbon === 0 ? '0 Pohon' : `~${annualTrees} Pohon`}
                  </div>
                  <div className="res-card__label">Dampak Positif Setara</div>
                </div>
              </div>
              <p className="calc-footnote">
                *Kalkulasi estimasi berdasarkan rata-rata volume reduksi limbah rumah tangga & pengunjung wisata nasional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

