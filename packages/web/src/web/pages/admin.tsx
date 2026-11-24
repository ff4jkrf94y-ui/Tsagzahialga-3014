import { BookingAlert } from "../components/booking-alert";
import { PriceSettings } from "../components/price-settings";
import { SalonSettings } from "../components/salon-settings";
import { useState } from "react";
import { authClient } from "../lib/auth";
import { useBookings, useStatus, useSettings } from "../queries/salon";
function Dashboard() {
  const list = useBookings(),
    status = useStatus();
  const [filter, setFilter] = useState("all");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const settings = useSettings();
  const labels: Record<string, string> = {
    pending: "Хүлээгдэж буй",
    confirmed: "Баталгаажсан",
    completed: "Дууссан",
    cancelled: "Цуцлагдсан",
  };
  return (
    <>
      <div className="admin-top">
        <h2>Захиалгууд</h2>
        <button
          className="pill"
          onClick={async () => {
            await authClient.signOut();
            localStorage.removeItem("salon-session");
            window.location.reload();
          }}
        >
          Гарах
        </button>
      </div>
      {list.isSuccess && (
        <>
          <BookingAlert bookings={list.data} />
          <SalonSettings />
          <PriceSettings />
        </>
      )}
      <h3 className="bookings-heading">Захиалгын жагсаалт</h3>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Бүх захиалга</option>
        {Object.entries(labels).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      {list.isLoading ? (
        <p>Ачаалж байна…</p>
      ) : list.isError ? (
        <p className="error">Энэ хэсэгт зөвхөн админ нэвтрэх эрхтэй.</p>
      ) : (
        <>
          <p>
            {
              list.data?.filter((b) => filter === "all" || b.status === filter)
                .length
            }{" "}
            захиалга
          </p>
          {list.data
            ?.filter((b) => filter === "all" || b.status === filter)
            .map((b) => (
              <article className="booking" key={b.id}>
                <div>
                  <strong>
                    {b.date} · {b.time}
                  </strong>
                  <h3>{b.name}</h3>
                  <a href={"tel:" + b.phone}>{b.phone}</a>
                  <p>
                    {
                      [
                        "Цэвэрлэгээ · классик маникюр",
                        "Гель будалт",
                        "Гоёлын будалт",
                        "Смарт хумс · энгийн будалт",
                        "Смарт хумс · гоёлын будалт",
                      ][b.service]
                    }
                  </p>
                  {b.note && <p>{b.note}</p>}
                </div>
                <div>
                  <p>{labels[b.status]}</p>
                  {b.status === "pending" && (
                    <button
                      disabled={status.isPending}
                      onClick={() =>
                        status.mutate({ id: b.id, status: "confirmed" })
                      }
                    >
                      Баталгаажуулах
                    </button>
                  )}
                  {b.status === "confirmed" && (
                    <div className="sms-action">
                      <a
                        className="sms-link"
                        href={`sms:+976${b.phone}${/iPad|iPhone|iPod/.test(navigator.userAgent) ? "&" : "?"}body=${encodeURIComponent(`Сайн байна уу, ${b.name}. Babe's nail zone: ${b.date}-ны ${b.time} цагийн захиалга тань баталгаажлаа. Хаяг: Эрдэнэт хот, ${settings.data?.address ?? ""}. Холбогдох утас: ${settings.data?.phone ?? ""}.`)}`}
                      >
                        SMS мэдэгдэл нээх
                      </a>
                      <small>Утасны мессеж нээгдэнэ. Та өөрөө илгээнэ.</small>
                    </div>
                  )}
                  {b.status === "confirmed" && (
                    <button
                      disabled={status.isPending}
                      onClick={() =>
                        status.mutate({ id: b.id, status: "completed" })
                      }
                    >
                      Дууссан
                    </button>
                  )}
                  {["pending", "confirmed"].includes(b.status) && (
                    <button
                      disabled={status.isPending}
                      onClick={() => setCancelId(b.id)}
                    >
                      Цуцлах
                    </button>
                  )}
                  {cancelId === b.id && (
                    <div className="cancel-check">
                      <p>Энэ захиалгыг цуцлах уу?</p>
                      <button
                        disabled={status.isPending}
                        onClick={() =>
                          status.mutate(
                            { id: b.id, status: "cancelled" },
                            { onSuccess: () => setCancelId(null) },
                          )
                        }
                      >
                        {status.isPending ? "Цуцалж байна…" : "Тийм, цуцлах"}
                      </button>
                      <button
                        disabled={status.isPending}
                        onClick={() => setCancelId(null)}
                      >
                        Үгүй, буцах
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
        </>
      )}
      {status.isError && (
        <p className="error">Өөрчилж чадсангүй. Дахин оролдоно уу.</p>
      )}
    </>
  );
}
export default function Admin() {
  const session = authClient.useSession();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <div className="admin section">
      <a href="/" className="logo">
        Babe's <i>nail zone</i>
      </a>
      {session.isPending ? (
        <p>Ачаалж байна…</p>
      ) : session.data ? (
        <Dashboard />
      ) : (
        <form
          className="login"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            const f = new FormData(e.currentTarget);
            try {
              const r = await authClient.signIn.email({
                email: String(f.get("email")),
                password: String(f.get("password")),
              });
              if (r.error) setError("Имэйл эсвэл нууц үг буруу байна.");
            } catch {
              setError("Нэвтэрч чадсангүй. Дахин оролдоно уу.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <p className="eyebrow">STUDIO MANAGEMENT</p>
          <h2>
            Админ <i>нэвтрэх</i>
          </h2>
          <label>
            Имэйл
            <input
              aria-label="Имэйл"
              name="email"
              type="email"
              autoComplete="username"
              required
            />
          </label>
          <label>
            Нууц үг
            <input
              aria-label="Нууц үг"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="pill full" disabled={busy}>
            {busy ? "Нэвтэрч байна…" : "Нэвтрэх"}
          </button>
        </form>
      )}
    </div>
  );
}
