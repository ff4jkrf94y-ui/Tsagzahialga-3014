import { useSettings, useSaveSettings } from "../queries/salon";
export function SalonSettings() {
  const query = useSettings();
  const save = useSaveSettings();
  if (query.isLoading) return <p>Тохиргоо ачаалж байна…</p>;
  if (query.isError || !query.data)
    return <p className="error">Тохиргоо ачаалж чадсангүй.</p>;
  const s = query.data;
  return (
    <section className="settings-panel">
      <p className="eyebrow">САЛОНЫ МЭДЭЭЛЭЛ</p>
      <h2>Салоны тохиргоо</h2>
      <p>Хадгалсан мэдээлэл нүүр хуудсанд шууд шинэчлэгдэнэ.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          save.mutate({
            address: String(f.get("address")),
            phone: String(f.get("phone")),
            open: String(f.get("open")),
            close: String(f.get("close")),
          });
        }}
      >
        <label>
          Хаяг
          <input
            aria-label="Салоны хаяг"
            name="address"
            defaultValue={s.address}
            required
            minLength={2}
            maxLength={300}
          />
        </label>
        <label>
          Утас
          <input
            aria-label="Салоны утас"
            name="phone"
            defaultValue={s.phone}
            required
            pattern="[0-9]{8}"
            maxLength={8}
            inputMode="numeric"
          />
        </label>
        <div className="hours-fields">
          <label>
            Нээх цаг
            <input
              aria-label="Нээх цаг"
              type="time"
              step={1800}
              name="open"
              defaultValue={s.open}
              required
            />
          </label>
          <label>
            Хаах цаг
            <input
              aria-label="Хаах цаг"
              type="time"
              step={1800}
              name="close"
              defaultValue={s.close}
              required
            />
          </label>
        </div>
        <p className="fine">
          Цагийг 30 минутын алхамтай тохируулна. Өмнөх захиалгууд өөрчлөгдөхгүй;
          шинэ захиалгын сул цаг шинэ хуваарийг дагана.
        </p>
        <button className="pill" disabled={save.isPending}>
          {save.isPending ? "Хадгалж байна…" : "Тохиргоо хадгалах"}
        </button>
        {save.isSuccess && (
          <output className="saved">
            Тохиргоо хадгалагдлаа.
          </output>
        )}
        {save.isError && (
          <p role="alert" className="error">
            {save.error.message}
          </p>
        )}
      </form>
    </section>
  );
}
