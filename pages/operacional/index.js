import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "../../src/components/Operacional/Operacional.module.css";

export default function Operacional({ user }) {
  const router = useRouter();
  const [panel, setPanel] = useState("dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoTotal, setPedidoTotal] = useState(0);
  const [estoque, setEstoque] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [qtdMap, setQtdMap] = useState({});

  const formatted = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  const statusLabel = {
    PENDING: "PENDENTE",
    PAID: "PAGO",
    SHIPPED: "ENVIADO",
    DELIVERED: "ENTREGUE",
    CANCELLED: "CANCELADO",
  };
  const statusBadge = {
    PENDING: styles.badgePending,
    PAID: styles.badgePaid,
    SHIPPED: styles.badgeShipped,
    DELIVERED: styles.badgeDelivered,
    CANCELLED: styles.badgeCancelled,
  };

  useEffect(() => {
    if (panel === "dashboard") fetchDashboard();
    if (panel === "pedidos") fetchPedidos();
    if (panel === "estoque") fetchEstoque();
  }, [panel]);

  useEffect(() => {
    if (panel === "pedidos") fetchPedidos();
  }, [filtroStatus, page]);

  useEffect(() => {
    if (panel !== "dashboard" && panel !== "pedidos") return;

    const interval = setInterval(() => {
      if (panel === "dashboard") fetchDashboard();
      if (panel === "pedidos") fetchPedidos();
    }, 10000); // atualiza a cada 10 segundos

    return () => clearInterval(interval);
  }, [panel, filtroStatus, page]);

  const fetchDashboard = async () => {
    const res = await fetch("/api/operacional/dashboard");
    const data = await res.json();
    setDashboard(data);
  };

  const fetchPedidos = async () => {
    const params = new URLSearchParams({ status: filtroStatus, page, search });
    const res = await fetch(`/api/operacional/pedidos?${params}`);
    const data = await res.json();
    setPedidos(data.orders || []);
    setPedidoTotal(data.total || 0);
    setPages(data.pages || 1);
  };

  const fetchEstoque = async () => {
    const res = await fetch("/api/operacional/estoque");
    const data = await res.json();
    setEstoque(data);
  };

  const handleUpdateStatus = async (id, status) => {
    await fetch("/api/operacional/pedidos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchPedidos();
    if (panel === "dashboard") fetchDashboard();
  };

  const handleEstoque = async (id) => {
    const qtd = parseInt(qtdMap[id] || 0);
    if (!qtd || qtd === 0) return alert("Informe uma quantidade válida");
    await fetch("/api/operacional/estoque", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantidade: qtd }),
    });
    setQtdMap({ ...qtdMap, [id]: "" });
    fetchEstoque();
  };

  const handleLogout = () => {
    deleteCookie("op_token");
    router.push("/operacional/login");
  };

  return (
    <div className={styles.page}>
      {/* NAV */}
      <div className={styles.topNav}>
        <div>
          <span className={styles.navLogo}>DOUR·ATTA</span>
          <span className={styles.navTag}>OPERACIONAL</span>
        </div>
        <div className={styles.navRight}>
          <span>OLÁ, {user?.name?.toUpperCase()}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            SAIR
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          {[
            { key: "dashboard", label: "DASHBOARD" },
            { key: "pedidos", label: "PEDIDOS" },
            { key: "estoque", label: "ESTOQUE" },
          ].map((m) => (
            <button
              key={m.key}
              className={`${styles.menuItem} ${panel === m.key ? styles.menuActive : ""}`}
              onClick={() => setPanel(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* CONTEÚDO */}
        <div className={styles.content}>
          {/* ── DASHBOARD ── */}
          {panel === "dashboard" && dashboard && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <div className={styles.sectionTitle}>VISÃO GERAL</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 10,
                    color: "#32a050",
                    letterSpacing: 2,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#32a050",
                      display: "inline-block",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  AO VIVO — atualiza a cada 10s
                </div>
              </div>
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>RECEITA TOTAL</div>
                  <div className={styles.metricValue}>
                    {formatted(dashboard.totalRevenue)}
                  </div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>TOTAL PEDIDOS</div>
                  <div className={styles.metricValue}>
                    {dashboard.totalOrders}
                  </div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>AGUARDANDO</div>
                  <div className={styles.metricValue}>
                    {dashboard.pendingOrders + dashboard.paidOrders}
                  </div>
                  <div className={styles.metricSub}>pendente + pago</div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>ENTREGUES</div>
                  <div className={styles.metricValue}>
                    {dashboard.deliveredOrders}
                  </div>
                </div>
              </div>

              <div className={styles.statusGrid}>
                {[
                  {
                    label: "PENDENTE",
                    value: dashboard.pendingOrders,
                    cls: styles.badgePending,
                  },
                  {
                    label: "PAGO",
                    value: dashboard.paidOrders,
                    cls: styles.badgePaid,
                  },
                  {
                    label: "ENVIADO",
                    value: dashboard.shippedOrders,
                    cls: styles.badgeShipped,
                  },
                  {
                    label: "ENTREGUE",
                    value: dashboard.deliveredOrders,
                    cls: styles.badgeDelivered,
                  },
                  {
                    label: "CANCELADO",
                    value: dashboard.cancelledOrders,
                    cls: styles.badgeCancelled,
                  },
                ].map((s) => (
                  <div key={s.label} className={styles.statusCard}>
                    <div className={styles.statusNum}>{s.value}</div>
                    <div className={`${styles.badge} ${s.cls}`}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Gráfico receita */}
              <div className={styles.chartCard}>
                <div className={styles.sectionTitle}>
                  RECEITA — ÚLTIMOS 7 DIAS
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dashboard.receitaPorDia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2520" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10, fill: "#6a5a48" }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#6a5a48" }}
                      tickFormatter={(v) => `R$${v}`}
                    />
                    <Tooltip
                      formatter={(v) => [
                        `R$ ${Number(v).toFixed(2)}`,
                        "Receita",
                      ]}
                      contentStyle={{
                        background: "#1a1814",
                        border: "0.5px solid #3a3530",
                        color: "#c9b99a",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="receita"
                      stroke="#9a7c4f"
                      strokeWidth={2}
                      dot={{ fill: "#9a7c4f" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Alerta estoque baixo */}
              {dashboard.lowStock.length > 0 && (
                <div className={styles.alertBox}>
                  ⚠ {dashboard.lowStock.length} produto(s) com estoque baixo (≤3
                  unidades):
                  {dashboard.lowStock
                    .map((p) => ` ${p.name} (${p.stock})`)
                    .join(" ·")}
                </div>
              )}

              {/* Pedidos recentes */}
              <div className={styles.sectionTitle}>PEDIDOS RECENTES</div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>PEDIDO</th>
                    <th>CLIENTE</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>DATA</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>#{String(o.id).padStart(3, "0")}</td>
                      <td>{o.user?.name}</td>
                      <td>{formatted(o.total)}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${statusBadge[o.status]}`}
                        >
                          {statusLabel[o.status]}
                        </span>
                      </td>
                      <td>
                        {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── PEDIDOS ── */}
          {panel === "pedidos" && (
            <div>
              <div className={styles.filters}>
                {[
                  "ALL",
                  "PENDING",
                  "PAID",
                  "SHIPPED",
                  "DELIVERED",
                  "CANCELLED",
                ].map((s) => (
                  <button
                    key={s}
                    className={`${styles.filterBtn} ${filtroStatus === s ? styles.filterActive : ""}`}
                    onClick={() => {
                      setFiltroStatus(s);
                      setPage(1);
                    }}
                  >
                    {s === "ALL" ? "TODOS" : statusLabel[s]}
                  </button>
                ))}
                <input
                  className={styles.searchInput}
                  placeholder="BUSCAR CLIENTE..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchPedidos()}
                />
              </div>

              <div
                style={{
                  marginBottom: 12,
                  fontSize: 11,
                  color: "#6a5a48",
                  letterSpacing: 1,
                }}
              >
                {pedidoTotal} pedido(s) encontrado(s)
              </div>

              {pedidos.length === 0 ? (
                <div className={styles.empty}>NENHUM PEDIDO ENCONTRADO</div>
              ) : (
                pedidos.map((o) => (
                  <div key={o.id} className={styles.card}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontFamily: "Georgia",
                            fontSize: 14,
                            color: "#f0e6d0",
                            letterSpacing: 2,
                          }}
                        >
                          PEDIDO #{String(o.id).padStart(3, "0")}
                        </span>
                        <span
                          className={`${styles.badge} ${statusBadge[o.status]}`}
                          style={{ marginLeft: 12 }}
                        >
                          {statusLabel[o.status]}
                        </span>
                        {o.coupon && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 10,
                              color: "#9a7c4f",
                            }}
                          >
                            🎟 {o.coupon.code}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "#6a5a48" }}>
                        {new Date(o.createdAt).toLocaleDateString("pt-BR")}{" "}
                        {new Date(o.createdAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#9a8a78",
                        marginBottom: 12,
                      }}
                    >
                      {o.user?.name} · {o.user?.email}
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      {o.items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            fontSize: 11,
                            color: "#6a5a48",
                            padding: "4px 0",
                            borderBottom: "0.5px solid #252320",
                          }}
                        >
                          {item.product?.name} × {item.quantity} —{" "}
                          {formatted(item.price)}
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "Georgia",
                          color: "#c9a96e",
                          fontSize: 16,
                        }}
                      >
                        TOTAL: {formatted(o.total)}
                      </div>
                      <div>
                        {[
                          "PENDING",
                          "PAID",
                          "SHIPPED",
                          "DELIVERED",
                          "CANCELLED",
                        ].map((s) => (
                          <button
                            key={s}
                            className={`${styles.actionBtn} ${o.status === s ? styles.filterActive : ""} ${s === "CANCELLED" ? styles.actionDel : ""}`}
                            onClick={() => handleUpdateStatus(o.id, s)}
                            disabled={o.status === s}
                          >
                            {statusLabel[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {pages > 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 24,
                    justifyContent: "center",
                  }}
                >
                  {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={`${styles.filterBtn} ${page === n ? styles.filterActive : ""}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ESTOQUE ── */}
          {panel === "estoque" && (
            <div>
              {estoque.filter((p) => p.stock <= 3).length > 0 && (
                <div className={styles.alertBox}>
                  ⚠ {estoque.filter((p) => p.stock <= 3).length} produto(s) com
                  estoque crítico (≤3 unidades)
                </div>
              )}

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>PRODUTO</th>
                    <th>CATEGORIA</th>
                    <th>ESTOQUE ATUAL</th>
                    <th>STATUS</th>
                    <th>ADICIONAR UNIDADES</th>
                  </tr>
                </thead>
                <tbody>
                  {estoque.map((p) => (
                    <tr key={p.id}>
                      <td style={{ color: "#f0e6d0" }}>{p.name}</td>
                      <td>{p.category?.name}</td>
                      <td
                        style={{
                          fontFamily: "Georgia",
                          fontSize: 16,
                          color: p.stock <= 3 ? "#c04040" : "#32a050",
                        }}
                      >
                        {p.stock}
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${p.stock <= 3 ? styles.badgeLow : styles.badgeOk}`}
                        >
                          {p.stock === 0
                            ? "SEM ESTOQUE"
                            : p.stock <= 3
                              ? "CRÍTICO"
                              : "OK"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.stockRow}>
                          <input
                            className={styles.stockInput}
                            type="number"
                            min="1"
                            placeholder="Qtd"
                            value={qtdMap[p.id] || ""}
                            onChange={(e) =>
                              setQtdMap({ ...qtdMap, [p.id]: e.target.value })
                            }
                          />
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleEstoque(p.id)}
                          >
                            + ADICIONAR
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  const { getCookie } = await import("cookies-next");
  const { verifyToken } = await import("../../services/auth");

  try {
    const token = getCookie("op_token", { req, res });
    if (!token) throw new Error("No token");
    const decoded = verifyToken(token);
    if (!["ADMIN", "OPERATOR"].includes(decoded.role))
      throw new Error("Unauthorized");

    const prisma = (await import("../../services/prisma")).default;
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: { id: true, name: true, email: true, role: true },
    });

    return { props: { user: JSON.parse(JSON.stringify(user)) } };
  } catch {
    return {
      redirect: { destination: "/operacional/login", permanent: false },
      props: {},
    };
  }
};
