import { useServices, useSavePrices } from "../queries/salon";
export function PriceSettings() {
  const query = useServices();
  const save = useSavePrices();
  if (query.isLoading) return <p>Үнийн мэдээлэл ачаалж байна…</p>;
  if (query.isError || !query.data)
    return <p className="error">Үнийн мэдээлэл ачаалж чадсангүй.</p>;
  return (
    <section className="settings-panel">
      <p className="eyebrow">ҮЙЛЧИЛГЭЭНИЙ ҮНЭ</p>
      <h2>Үнийн тохиргоо</h2>
      <p>
        Үнээ төгрөгөөр оруулаад хадгалаарай. Нүүр хуудас болон шинэ захиалгад
        шинэ үнэ харагдана.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          save.mutate({
            prices: query.data!.map((s) => ({
              id: s.id,
              price: Number(f.get(`price-${s.id}`)),
            })),
          });
        }}
      >
        {query.data.map((s) => (
          <label key={s.id}>
            {s.name} (₮)
            <input
              aria-label={`${s.name} үнэ`}
              type="number"
              name={`price-${s.id}`}
              defaultValue={s.price}
              min={0}
              max={10000000}
              step={1}
              required
            />
          </label>
        ))}
        <button className="pill" disabled={save.isPending}>
          {save.isPending ? "Хадгалж байна…" : "Үнэ хадгалах"}
        </button>
        {save.isSuccess && (
          <output className="saved">Үнийн өөрчлөлт хадгалагдлаа.</output>
        )}
        {save.isError && (
          <p className="error">Хадгалж чадсангүй: {save.error.message}</p>
        )}
      </form>
    </section>
  );
}
