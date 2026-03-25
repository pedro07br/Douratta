import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../src/components/Navbar/Navbar";
import { useCart } from "../src/context/CartContext";
import styles from "../src/components/Checkout/Checkout.module.css";

export default function Checkout() {
  const router = useRouter();
  const { items, total, count } = useCart();
  const [step, setStep] = useState(2);
  const [payMethod, setPayMethod] = useState("cartao");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);

  const [address, setAddress] = useState({
    name: "",
    cpf: "",
    zipCode: "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    installments: "1",
  });

  const formatted = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const handleOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
          total,
          couponCode: coupon?.code || null,
          address,
          payMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      router.push(`/confirmacao?pedido=${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="marble">
        <Navbar />
        <div className={styles.empty}>
          <p>SEU CARRINHO ESTÁ VAZIO</p>
          <Link href="/produtos">
            <button className={styles.backBtn}>VER COLEÇÃO</button>
          </Link>
        </div>
      </div>
    );
  }

  const applyCoupon = async () => {
    setCouponError("");
    if (!couponCode.trim()) return;

    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode }),
    });
    const data = await res.json();

    if (!res.ok) return setCouponError(data.message);

    setCoupon(data);

    if (data.type === "PERCENTAGE") {
      setDiscount(total * (parseFloat(data.value) / 100));
    } else if (data.type === "FIXED") {
      setDiscount(parseFloat(data.value));
    } else if (data.type === "FREESHIP") {
      setDiscount(0);
    }
  };

  return (
    <div className="marble">
      <Navbar />

      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={`${styles.stepNum} ${styles.stepDone}`}>✓</div>
          <span className={styles.stepLabel}>CARRINHO</span>
        </div>
        <div className={styles.stepSep} />
        <div className={styles.step}>
          <div
            className={`${styles.stepNum} ${step >= 2 ? styles.stepActive : ""}`}
          >
            2
          </div>
          <span
            className={`${styles.stepLabel} ${step >= 2 ? styles.stepLabelActive : ""}`}
          >
            ENTREGA
          </span>
        </div>
        <div className={styles.stepSep} />
        <div className={styles.step}>
          <div
            className={`${styles.stepNum} ${step >= 3 ? styles.stepActive : ""}`}
          >
            3
          </div>
          <span
            className={`${styles.stepLabel} ${step >= 3 ? styles.stepLabelActive : ""}`}
          >
            PAGAMENTO
          </span>
        </div>
        <div className={styles.stepSep} />
        <div className={styles.step}>
          <div
            className={`${styles.stepNum} ${step >= 4 ? styles.stepActive : ""}`}
          >
            4
          </div>
          <span className={styles.stepLabel}>CONFIRMAÇÃO</span>
        </div>
      </div>

      <div className={styles.wrapper}>
        <div>
          {/* ENDEREÇO */}
          <div className={styles.card}>
            <div className={styles.sectionTitle}>ENDEREÇO DE ENTREGA</div>
            <div className={styles.sectionDivider} />
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>NOME COMPLETO</div>
                <input
                  className={styles.fieldInput}
                  value={address.name}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                  placeholder="Ana Silva"
                />
              </div>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>CPF</div>
                <input
                  className={styles.fieldInput}
                  value={address.cpf}
                  onChange={(e) =>
                    setAddress({ ...address, cpf: e.target.value })
                  }
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>CEP</div>
                <input
                  className={styles.fieldInput}
                  value={address.zipCode}
                  onChange={(e) =>
                    setAddress({ ...address, zipCode: e.target.value })
                  }
                  placeholder="00000-000"
                />
              </div>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>TELEFONE</div>
                <input
                  className={styles.fieldInput}
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <div className={styles.fieldRow3}>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>RUA</div>
                <input
                  className={styles.fieldInput}
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  placeholder="Rua das Flores"
                />
              </div>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>NÚMERO</div>
                <input
                  className={styles.fieldInput}
                  value={address.number}
                  onChange={(e) =>
                    setAddress({ ...address, number: e.target.value })
                  }
                  placeholder="123"
                />
              </div>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>COMPLEMENTO</div>
                <input
                  className={styles.fieldInput}
                  value={address.complement}
                  onChange={(e) =>
                    setAddress({ ...address, complement: e.target.value })
                  }
                  placeholder="Apto 42"
                />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>BAIRRO</div>
                <input
                  className={styles.fieldInput}
                  value={address.district}
                  onChange={(e) =>
                    setAddress({ ...address, district: e.target.value })
                  }
                  placeholder="Jardim Europa"
                />
              </div>
              <div className={styles.field}>
                <div className={styles.fieldLabel}>CIDADE</div>
                <input
                  className={styles.fieldInput}
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  placeholder="São Paulo"
                />
              </div>
            </div>
          </div>

          {/* PAGAMENTO */}
          <div className={styles.card}>
            <div className={styles.sectionTitle}>FORMA DE PAGAMENTO</div>
            <div className={styles.sectionDivider} />
            <div className={styles.paymentOpts}>
              {["cartao", "pix", "boleto"].map((opt) => (
                <div
                  key={opt}
                  className={`${styles.payOpt} ${payMethod === opt ? styles.payOptActive : ""}`}
                  onClick={() => setPayMethod(opt)}
                >
                  <div className={styles.payOptIcon}>
                    {opt === "cartao" ? "💳" : opt === "pix" ? "📱" : "📄"}
                  </div>
                  <div className={styles.payOptLabel}>
                    {opt === "cartao"
                      ? "CARTÃO"
                      : opt === "pix"
                        ? "PIX"
                        : "BOLETO"}
                  </div>
                </div>
              ))}
            </div>

            {payMethod === "cartao" && (
              <>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>NÚMERO DO CARTÃO</div>
                  <input
                    className={styles.fieldInput}
                    value={payment.cardNumber}
                    onChange={(e) =>
                      setPayment({ ...payment, cardNumber: e.target.value })
                    }
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>NOME NO CARTÃO</div>
                  <input
                    className={styles.fieldInput}
                    value={payment.cardName}
                    onChange={(e) =>
                      setPayment({ ...payment, cardName: e.target.value })
                    }
                    placeholder="ANA SILVA"
                  />
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>VALIDADE</div>
                    <input
                      className={styles.fieldInput}
                      value={payment.expiry}
                      onChange={(e) =>
                        setPayment({ ...payment, expiry: e.target.value })
                      }
                      placeholder="MM/AA"
                    />
                  </div>
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>CVV</div>
                    <input
                      className={styles.fieldInput}
                      value={payment.cvv}
                      onChange={(e) =>
                        setPayment({ ...payment, cvv: e.target.value })
                      }
                      placeholder="000"
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>PARCELAS</div>
                  <select
                    className={styles.fieldInput}
                    value={payment.installments}
                    onChange={(e) =>
                      setPayment({ ...payment, installments: e.target.value })
                    }
                  >
                    <option value="1">
                      1x de {formatted(total)} sem juros
                    </option>
                    <option value="2">
                      2x de {formatted(total / 2)} sem juros
                    </option>
                    <option value="3">
                      3x de {formatted(total / 3)} sem juros
                    </option>
                    <option value="6">
                      6x de {formatted(total / 6)} sem juros
                    </option>
                  </select>
                </div>
              </>
            )}

            {payMethod === "pix" && (
              <div className={styles.pixInfo}>
                <p>
                  Após finalizar o pedido, você receberá um QR Code para
                  pagamento via PIX.
                </p>
                <p>
                  O pedido será confirmado em até 5 minutos após o pagamento.
                </p>
              </div>
            )}

            {payMethod === "boleto" && (
              <div className={styles.pixInfo}>
                <p>O boleto será gerado após a confirmação do pedido.</p>
                <p>Prazo de vencimento: 3 dias úteis.</p>
              </div>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        {/* RESUMO */}
        <div className={styles.summary}>
          <div className={styles.summaryTitle}>RESUMO DO PEDIDO</div>
          {items.map((item) => (
            <div key={item.id} className={styles.orderItem}>
              <div className={styles.orderImg}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    <circle
                      cx="15"
                      cy="15"
                      r="10"
                      fill="none"
                      stroke="#9a7c4f"
                      strokeWidth="1"
                    />
                    <circle
                      cx="15"
                      cy="15"
                      r="4"
                      fill="#c9a96e"
                      fillOpacity="0.5"
                    />
                  </svg>
                )}
              </div>
              <div className={styles.orderInfo}>
                <div className={styles.orderName}>{item.name}</div>
                <div className={styles.orderQty}>Qtd: {item.quantity}</div>
              </div>
              <div className={styles.orderPrice}>
                {formatted(Number(item.price) * item.quantity)}
              </div>
            </div>
          ))}

          {/* CUPOM */}
          <div className={styles.couponRow}>
            <input
              className={styles.couponInput}
              placeholder="CÓDIGO DO CUPOM"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <button className={styles.couponBtn} onClick={applyCoupon}>
              APLICAR
            </button>
          </div>
          {couponError && (
            <div className={styles.couponError}>{couponError}</div>
          )}
          {coupon && (
            <div className={styles.couponSuccess}>
              ✓{" "}
              {coupon.type === "PERCENTAGE"
                ? `${coupon.value}% OFF`
                : coupon.type === "FIXED"
                  ? `R$ ${coupon.value} OFF`
                  : "FRETE GRÁTIS"}{" "}
              aplicado!
            </div>
          )}

          {/* TOTAIS */}
          <div className={styles.summaryLine}>
            <span>SUBTOTAL</span>
            <span>{formatted(total)}</span>
          </div>
          {discount > 0 && (
            <div className={styles.summaryLine} style={{ color: "#27ae60" }}>
              <span>DESCONTO</span>
              <span>- {formatted(discount)}</span>
            </div>
          )}
          <div className={styles.summaryLine}>
            <span>FRETE</span>
            <span>{coupon?.type === "FREESHIP" ? "✓ GRÁTIS" : "GRÁTIS"}</span>
          </div>
          <div className={styles.summaryTotal}>
            <span className={styles.totalLabel}>TOTAL</span>
            <span className={styles.totalValue}>
              {formatted(Math.max(0, total - discount))}
            </span>
          </div>
          <div className={styles.summaryLine}>
            <span>SUBTOTAL</span>
            <span>{formatted(total)}</span>
          </div>
          <div className={styles.summaryLine}>
            <span>FRETE</span>
            <span>GRÁTIS</span>
          </div>
          <div className={styles.summaryTotal}>
            <span className={styles.totalLabel}>TOTAL</span>
            <span className={styles.totalValue}>{formatted(total)}</span>
          </div>
          <button
            className={styles.placeBtn}
            onClick={handleOrder}
            disabled={loading}
          >
            {loading ? "PROCESSANDO..." : "FINALIZAR PEDIDO"}
          </button>
          <div className={styles.secure}>🔒 PAGAMENTO 100% SEGURO</div>
        </div>
      </div>
    </div>
  );
}
