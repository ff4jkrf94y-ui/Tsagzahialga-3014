import { useEffect, useRef, useState } from "react";
import { Bell, BellOff, Volume2 } from "lucide-react";
type Booking = { id: string; name: string; date: string; time: string };
export function BookingAlert({ bookings }: { bookings: Booking[] }) {
  const seen = useRef<Set<string> | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  async function chime() {
    if (!audio.current) audio.current = new AudioContext();
    const ctx = audio.current;
    await ctx.resume();
    if (ctx.state !== "running") throw new Error("Audio blocked");
    [660, 880, 1047].forEach((frequency, i) => {
      const osc = ctx.createOscillator(),
        gain = ctx.createGain(),
        start = ctx.currentTime + i * 0.18;
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.36);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    });
  }
  useEffect(() => {
    const current = new Set(bookings.map((b) => b.id));
    if (seen.current === null) {
      seen.current = current;
      return;
    }
    const added = bookings.filter((b) => !seen.current!.has(b.id));
    for (const id of current) seen.current.add(id);
    if (!enabled || !added.length) return;
    setNotice(
      `${added.length} шинэ захиалга: ${added[0]!.name} · ${added[0]!.date} ${added[0]!.time}`,
    );
    void chime().catch(() => {
      setError(
        "Дуу тоглуулах боломжгүй байна. «Дуу шалгах» товчийг дахин дарна уу.",
      );
      setEnabled(false);
    });
  }, [bookings, enabled]);
  useEffect(
    () => () => {
      void audio.current?.close();
    },
    [],
  );
  async function enable() {
    setError("");
    try {
      await chime();
      setEnabled(true);
    } catch {
      setError(
        "Дуу асааж чадсангүй. Хөтчийн дуу болон утасныхаа дууны түвшнийг шалгаарай.",
      );
    }
  }
  return (
    <section className="booking-alert">
      <div className="alert-heading">
        {enabled ? <Bell size={21} /> : <BellOff size={21} />}
        <h3>Шинэ захиалгын дуут мэдэгдэл</h3>
      </div>
      <p>
        {enabled
          ? "Дуут мэдэгдэл асаалттай · 5 секунд тутам шинэчилнэ."
          : "Админ хуудсаа нээлттэй байлгаад доорх товчийг нэг удаа дарна уу."}
      </p>
      <div className="alert-actions">
        {enabled ? (
          <>
            <button className="pill" onClick={() => setEnabled(false)}>
              Дуу унтраах
            </button>
            <button className="test-sound" onClick={enable}>
              <Volume2 size={16} />
              Дуу шалгах
            </button>
          </>
        ) : (
          <button className="pill" onClick={enable}>
            Дуут мэдэгдэл асаах
          </button>
        )}
      </div>
      <p className="fine">
        Хуудас хаалттай, утас түгжээтэй эсвэл хөтөч түр зогссон үед ажиллахгүй
        байж болно. Хуудас дахин нээхэд дууг дахин асаана.
      </p>
      {notice && (
        <div className="new-booking">
          <output>{notice}</output>
          <button onClick={() => setNotice("")}>Харлаа</button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </section>
  );
}
