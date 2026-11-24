import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  X,
  Check,
  Phone,
  MapPin,
  Clock,
  Plus,
  Minus,
} from "lucide-react";
import { useServices, useSlots, useBook, useSettings } from "../queries/salon";
const money = (n: number) => n.toLocaleString() + "₮";
export default function Home() {
  const services = useServices();
  const settingsQuery = useSettings();
  const settings = settingsQuery.data;
  const [open, setOpen] = useState(false),
    [service, setService] = useState(1),
    [date, setDate] = useState(""),
    [time, setTime] = useState(""),
    [step, setStep] = useState(1),
    [faq, setFaq] = useState(-1);
  const slots = useSlots(date, service);
  const book = useBook();
  const selected = services.data?.[service];
  function start(s = 1) {
    setService(s);
    setOpen(true);
    setStep(1);
    book.reset();
    setTime("");
  }
  return (
    <>
      <header>
        <a href="/" className="logo">
          Babe's <i>nail zone</i>
          <span>NAIL STUDIO · ЭРДЭНЭТ ХОТ</span>
        </a>
        <nav>
          <a href="#services">Үйлчилгээ</a>
          <a href="#about">Бидний тухай</a>
          <a href="#contact">Холбоо барих</a>
        </nav>
        <div className="header-actions">
          <a href="/admin" className="admin-link">
            Админ нэвтрэх <ArrowUpRight size={15} />
          </a>
          <button className="pill" onClick={() => start()}>
            Цаг захиалах <ArrowUpRight size={16} />
          </button>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="photo p1">
            <img alt="Маникюрын жишиг дизайн" src="/images/hero.jpg" />
            <span>YOUR LITTLE BEAUTY RITUAL</span>
          </div>
          <div className="photo p2">
            <img alt="Маникюрын жишиг дизайн" src="/images/detail.jpg" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">ЧИНИЙ ӨӨРТӨӨ ЗОРИУЛАХ ЦАГ</p>
            <h1>
              Нямбай арчилгаа.
              <br />
              Гоёмсог <i>хумс.</i>
            </h1>
            <p>
              Гоёмсог хумс, өөртөө итгэлтэй чи.
              <br />
              Babe's nail zone-д өөрийгөө эрхлүүлээрэй.
            </p>
            <a className="text-link" href="#services">
              Үйлчилгээ, үнэ харах <ArrowRight size={17} />
            </a>
            <small>Чиний хэв маяг. Чиний өнгө. Чиний цаг.</small>
          </div>
          <div className="photo p3">
            <img alt="Маникюрын жишиг дизайн" src="/images/detail.jpg" />
          </div>
          <div className="photo p4">
            <img alt="Маникюрын жишиг дизайн" src="/images/hero.jpg" />
            <span>MADE FOR YOU, BABE.</span>
          </div>
          <span className="spark">✳</span>
          <span className="scroll">ДООШ ГҮЙЛГЭЭРЭЙ ↓</span>
        </section>
        <section className="lavender">
          <p className="eyebrow">A LITTLE CARE GOES A LONG WAY</p>
          <h2>
            Өнгө, хэлбэрээ сонгоод
            <br />
            <i>арчилгаагаа бидэнд даатгаарай.</i>
          </h2>
          <div className="perks">
            <div>
              <span>01 /</span>
              <h3>Чиний хүссэн өнгө</h3>
              <p>
                Даруухан эсвэл содон. Өөрийн хэв маягт тохирсон будалтаа сонго.
              </p>
            </div>
            <div>
              <span>02 /</span>
              <h3>Нямбай арчилгаа</h3>
              <p>Хэлбэр засалтаас төгсгөл хүртэл жижиг деталь бүрд анхаарна.</p>
            </div>
            <div>
              <span>03 /</span>
              <h3>Хялбар захиалга</h3>
              <p>Үйлчилгээ, өдөр, цагаа сонгоод хэдхэн алхмаар захиалаарай.</p>
            </div>
          </div>
        </section>
        <section id="services" className="services section">
          <div className="section-top">
            <div>
              <p className="eyebrow">THE NAIL MENU</p>
              <h2>
                Маникюр, будалт,
                <br />
                <i>хумс уртасгалт.</i>
              </h2>
            </div>
            <p>
              Энгийн арчилгаанаас шинэ төрх хүртэл.
              <br />
              Өнөөдөр юуг сонгомоор байна?
            </p>
          </div>
          {services.isLoading ? (
            <p>Үйлчилгээ ачаалж байна…</p>
          ) : services.isError ? (
            <p>
              Үйлчилгээ ачаалж чадсангүй.{" "}
              <button onClick={() => services.refetch()}>Дахин оролдох</button>
            </p>
          ) : (
            <div className="menu">
              {services.data?.map((s, i) => (
                <button
                  className="service"
                  key={s.id}
                  onClick={() => start(s.id)}
                >
                  <span className="number">0{i + 1}</span>
                  <div>
                    <h3>
                      {s.name}
                      {i === 1 && <em>ХАМГИЙН ЭРЭЛТТЭЙ</em>}
                    </h3>
                    <p>{s.description}</p>
                  </div>

                  <strong>
                    {money(s.price)}
                    <ArrowUpRight size={20} />
                  </strong>
                </button>
              ))}
            </div>
          )}
          <p className="fine">
            * Түр жишиг үнэ. Нэмэлт дизайн, уртасгалтаас хамаарч үнэ өөрчлөгдөж
            болно.
          </p>
        </section>
        <section id="about" className="about section">
          <div className="about-image">
            <img alt="Маникюрын жишиг дизайн" src="/images/detail.jpg" />
            <span>Урам зоригийн зураг · жишиг дизайн</span>
          </div>
          <div>
            <p className="eyebrow">WELCOME TO YOUR NAIL ROOM</p>
            <h2>
              Таны хүссэн өнгө.
              <br />
              <i>Чанартай бүтээгдэхүүн.</i>
            </h2>
            <p>
              Чанартай бүтээгдэхүүн, нямбай арчилгаа, удаан тогтоцтой будалтад
              анхаардаг. Өөрийн хүссэн өнгө, загвараа сонгоод хумсаа
              арчлуулаарай.
            </p>
            <p>
              Шинэ артист тул үйлчилгээ бүрийг яаралгүй, нямбай хийдэг. Хүссэн
              өнгө, загвараа хамт сонгоод, хумсаа арчлуулъя.
            </p>
            <a className="text-link" href="#contact">
              Манай хаяг <ArrowRight size={18} />
            </a>
          </div>
        </section>
        <section className="cta">
          <p className="eyebrow">GOOD NAILS. GOOD MOOD.</p>
          <h2>
            Маникюрын цагаа
            <br />
            <i>урьдчилан захиалаарай.</i>
          </h2>

          <p>
            Дээд хэсгийн «Цаг захиалах» товч эсвэл үйлчилгээ дээр дарж захиална.
          </p>
        </section>
        <section className="faq section">
          <p className="eyebrow">A FEW THINGS TO KNOW</p>
          <h2>
            Түгээмэл <i>асуултууд</i>
          </h2>
          {[
            [
              "Цаг хэрхэн захиалах вэ?",
              "Цаг захиалах товч дээр дарж үйлчилгээ, өдөр, сул цаг сонгоно. Нэр, утсаа оруулсны дараа захиалга хадгалагдана. Салон баталгаажуулах хүртэл хүлээгдэж буй төлөвтэй байна.",
            ],
            [
              "Хүссэн загвараа урьдчилан явуулж болох уу?",
              "Болно. Хүссэн өнгө, дизайнаа захиалгын нэмэлт хүсэлтэд бичээрэй. Дэлгэрэнгүй тохирох бол утсаар холбогдоорой.",
            ],
            [
              "Захиалгаа өөрчлөх эсвэл цуцлах бол?",
              `${settings?.phone ?? ""} дугаарт залгаж захиалсан нэр, өдөр, цагаа хэлээрэй. Боломжтой бол урьдчилан мэдэгдэнэ үү.`,
            ],
          ].map(([q, a], i) => (
            <div className="faq-item" key={q}>
              <button onClick={() => setFaq(faq === i ? -1 : i)}>
                {q}
                {faq === i ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              {faq === i && <p>{a}</p>}
            </div>
          ))}
        </section>
        <section id="contact" className="contact section">
          <div>
            <p className="eyebrow">COME SAY HELLO</p>
            <h2>
              Чамайг <i>хүлээж байна.</i>
            </h2>
          </div>
          <div className="contact-info">
            <p>
              <MapPin size={20} />
              {settingsQuery.isLoading
                ? "Ачаалж байна…"
                : (settings?.address ?? "Мэдээлэл ачаалж чадсангүй")}
            </p>
            <a href={settings ? `tel:${settings.phone}` : undefined}>
              <Phone size={20} />
              {settings?.phone ?? "—"}
            </a>
            <p>
              <Clock size={20} />
              {settings ? `${settings.open}–${settings.close}` : "—"}
            </p>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-logo">
          Babe's <i>nail zone</i>
        </div>
        <div>
          <span>© {new Date().getFullYear()} Babe's nail zone</span>
          <a href="/admin">
            Админ нэвтрэх <ArrowUpRight size={13} />
          </a>
        </div>
      </footer>
      {open && (
        <div className="overlay">
          <dialog
            open
            className="modal"
            aria-modal="true"
            aria-label="Цаг захиалах"
          >
            <button
              className="close"
              aria-label="Хаах"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
            {book.isSuccess ? (
              <div className="success">
                <Check size={40} />
                <p className="eyebrow">THANK YOU, BABE</p>
                <h2>Захиалга илгээгдлээ.</h2>
                <p>
                  {selected?.name}
                  <br />
                  {date} · {time}
                  <br />
                  Салон баталгаажуулах хүртэл хүлээгдэж байна.
                </p>
                <p>
                  Лавлах утас:{" "}
                  <a href={settings ? `tel:${settings.phone}` : undefined}>
                    {settings?.phone ?? "—"}
                  </a>
                </p>
                <button className="pill" onClick={() => setOpen(false)}>
                  Боллоо
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow">YOUR NEXT BEAUTY MOMENT</p>
                <h2>
                  Цаг <i>захиалах</i>
                </h2>
                <div className="steps">
                  <span className={step === 1 ? "active" : ""}>
                    01 Үйлчилгээ
                  </span>
                  <span className={step === 2 ? "active" : ""}>
                    02 Өдөр, цаг
                  </span>
                  <span className={step === 3 ? "active" : ""}>
                    03 Мэдээлэл
                  </span>
                </div>
                {step === 1 && (
                  <>
                    <div className="choices">
                      {services.data?.map((s) => (
                        <button
                          className={service === s.id ? "chosen" : ""}
                          key={s.id}
                          onClick={() => {
                            setService(s.id);
                            setTime("");
                          }}
                        >
                          <span>{s.name}</span>
                          <strong>{money(s.price)}</strong>
                        </button>
                      ))}
                    </div>
                    <button
                      className="pill full"
                      disabled={!selected}
                      onClick={() => setStep(2)}
                    >
                      Үргэлжлүүлэх <ArrowRight size={18} />
                    </button>
                  </>
                )}
                {step === 2 && (
                  <>
                    <label>
                      Өдөр сонгох
                      <input
                        aria-label="Захиалгын мэдээлэл"
                        type="date"
                        value={date}
                        min={new Intl.DateTimeFormat("en-CA", {
                          timeZone: "Asia/Ulaanbaatar",
                        }).format(new Date())}
                        max={new Date(Date.now() + 90 * 86400000)
                          .toISOString()
                          .slice(0, 10)}
                        onChange={(e) => {
                          setDate(e.target.value);
                          setTime("");
                        }}
                      />
                    </label>
                    <p className="eyebrow">СУЛ ЦАГ · ЭРДЭНЭТ ХОТЫН ЦАГААР</p>
                    {!date ? (
                      <p>Эхлээд өдрөө сонгоно уу.</p>
                    ) : slots.isLoading ? (
                      <p>Сул цаг шалгаж байна…</p>
                    ) : slots.isError ? (
                      <p className="error">{slots.error.message}</p>
                    ) : slots.data?.length ? (
                      <div className="times">
                        {slots.data.map((t) => (
                          <button
                            className={time === t ? "chosen" : ""}
                            key={t}
                            onClick={() => setTime(t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p>Энэ өдөр сул цаг алга. Өөр өдөр сонгоорой.</p>
                    )}
                    <div className="actions">
                      <button onClick={() => setStep(1)}>Буцах</button>
                      <button
                        className="pill"
                        disabled={!time}
                        onClick={() => setStep(3)}
                      >
                        Үргэлжлүүлэх <ArrowRight size={16} />
                      </button>
                    </div>
                  </>
                )}
                {step === 3 && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const f = new FormData(e.currentTarget);
                      book.mutate(
                        {
                          service,
                          date,
                          time,
                          name: String(f.get("name")),
                          phone: String(f.get("phone")),
                          note: String(f.get("note")),
                        },
                        { onError: () => slots.refetch() },
                      );
                    }}
                  >
                    <div className="summary">
                      {selected?.name} · {selected && money(selected.price)}
                      <br />
                      {date} · {time}
                    </div>
                    <label>
                      Таны нэр
                      <input
                        aria-label="Захиалгын мэдээлэл"
                        name="name"
                        required
                        minLength={2}
                        maxLength={80}
                        placeholder="Нэрээ оруулна уу"
                      />
                    </label>
                    <label>
                      Утасны дугаар
                      <input
                        aria-label="Захиалгын мэдээлэл"
                        name="phone"
                        required
                        pattern="[0-9]{8}"
                        inputMode="numeric"
                        maxLength={8}
                        placeholder="8 оронтой дугаар"
                      />
                    </label>
                    <label>
                      Нэмэлт хүсэлт <small>(заавал биш)</small>
                      <textarea
                        aria-label="Нэмэлт хүсэлт"
                        name="note"
                        maxLength={500}
                        placeholder="Хүссэн өнгө, дизайн…"
                      />
                    </label>
                    <p className="fine">
                      Нэр, утсыг зөвхөн захиалга зохицуулахад ашиглана.
                    </p>
                    {book.isError && (
                      <p className="error">{book.error.message}</p>
                    )}
                    <div className="actions">
                      <button
                        type="button"
                        onClick={() => {
                          setStep(2);
                          setTime("");
                        }}
                      >
                        Буцах
                      </button>
                      <button className="pill" disabled={book.isPending}>
                        {book.isPending ? "Илгээж байна…" : "Захиалга илгээх"}{" "}
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </dialog>
        </div>
      )}
    </>
  );
}
