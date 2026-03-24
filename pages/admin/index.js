import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";
import styles from "../../src/components/Admin/Admin.module.css";

export default function Admin({ user }) {
  const router = useRouter();
  const [panel, setPanel] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    active: true,
    categoryId: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    imageUrl: "",
  });

  const fetchDashboard = async () => {
    const res = await fetch("/api/admin/dashboard");
    const data = await res.json();
    setDashboard(data);
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/produtos");
    const data = await res.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/pedidos");
    const data = await res.json();
    setOrders(data);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categorias");
    const data = await res.json();
    setCategories(data);
  };

  const fetchUsuarios = async () => {
    const res = await fetch("/api/admin/usuarios");
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => {
    if (panel === "dashboard") fetchDashboard();
    if (panel === "produtos") {
      fetchProducts();
      fetchCategories();
    }
    if (panel === "pedidos") fetchOrders();
    if (panel === "categorias") {
      fetchCategories();
      fetchProducts();
    }
    if (panel === "usuarios") fetchUsuarios();
  }, [panel]);

  const formatted = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  const handleSaveProduct = async () => {
    if (!productForm.categoryId) {
      alert("Selecione uma categoria!");
      return;
    }

    const slugGerado =
      productForm.slug ||
      productForm.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    const method = editProduct ? "PUT" : "POST";
    const body = editProduct
      ? { ...productForm, slug: slugGerado, id: editProduct.id }
      : { ...productForm, slug: slugGerado };

    const res = await fetch("/api/admin/produtos", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setEditProduct(null);
      setShowProductForm(false);
      setProductForm({
        name: "",
        slug: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        active: true,
        categoryId: "",
      });
      fetchProducts();
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Remover produto?")) return;
    await fetch("/api/admin/produtos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProducts();
  };

  const handleUpdateOrder = async (id, status) => {
    await fetch("/api/admin/pedidos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
    setEditOrder(null);
  };

  const handleSaveCategory = async () => {
    const slugGerado =
      categoryForm.slug ||
      categoryForm.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    const method = editCategory ? "PUT" : "POST";
    const body = editCategory
      ? { ...categoryForm, slug: slugGerado, id: editCategory.id }
      : { ...categoryForm, slug: slugGerado };

    await fetch("/api/admin/categorias", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEditCategory(null);
    setShowCategoryForm(false);
    setCategoryForm({ name: "", slug: "", imageUrl: "" });
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Remover categoria?")) return;
    await fetch("/api/admin/categorias", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCategories();
  };

  const handleToggleAdmin = async (id, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
    await fetch("/api/admin/usuarios", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });
    fetchUsuarios();
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Remover usuário? Esta ação não pode ser desfeita.")) return;
    await fetch("/api/admin/usuarios", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUsuarios();
  };

  const openEditProduct = (p) => {
    setEditProduct(p);
    setProductForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl || "",
      active: p.active,
      categoryId: p.categoryId,
    });
    setShowProductForm(true);
  };

  const statusLabel = {
    PENDING: "PENDENTE",
    PAID: "PAGO",
    SHIPPED: "ENVIADO",
    DELIVERED: "ENTREGUE",
    CANCELLED: "CANCELADO",
  };

  const statusStyle = {
    PENDING: styles.statusPending,
    PAID: styles.statusPaid,
    SHIPPED: styles.statusShipped,
    DELIVERED: styles.statusDelivered,
    CANCELLED: styles.statusCancelled,
  };

  return (
    <div className={styles.page}>
      <div className={styles.adminNav}>
        <div className={styles.adminLogo}>
          DOUR<span className={styles.logoAccent}>·</span>ATTA{" "}
          <span className={styles.adminTag}>ADMIN</span>
        </div>
        <div className={styles.adminUser}>
          OLÁ, {user?.name?.toUpperCase()} ·{" "}
          <span
            className={styles.logoutBtn}
            onClick={() => {
              deleteCookie("authorization");
              router.push("/login");
            }}
          >
            SAIR
          </span>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          {["dashboard", "produtos", "pedidos", "usuarios", "categorias"].map(
            (p) => (
              <button
                key={p}
                className={`${styles.menuItem} ${panel === p ? styles.menuActive : ""}`}
                onClick={() => setPanel(p)}
              >
                {
                  {
                    dashboard: "DASHBOARD",
                    produtos: "PRODUTOS",
                    pedidos: "PEDIDOS",
                    usuarios: "USUÁRIOS",
                    categorias: "CATEGORIAS",
                  }[p]
                }
              </button>
            ),
          )}
        </div>

        <div className={styles.content}>
          {/* DASHBOARD */}
          {panel === "dashboard" && dashboard && (
            <div>
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>RECEITA TOTAL</div>
                  <div className={styles.metricValue}>
                    {formatted(dashboard.revenue)}
                  </div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>PEDIDOS</div>
                  <div className={styles.metricValue}>{dashboard.orders}</div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>PRODUTOS</div>
                  <div className={styles.metricValue}>{dashboard.products}</div>
                </div>
                <div className={styles.metric}>
                  <div className={styles.metricLabel}>USUÁRIOS</div>
                  <div className={styles.metricValue}>{dashboard.users}</div>
                </div>
              </div>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>PEDIDOS RECENTES</div>
              </div>
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
                  {dashboard.recentOrders?.map((o) => (
                    <tr key={o.id}>
                      <td>#{String(o.id).padStart(3, "0")}</td>
                      <td>{o.user?.name}</td>
                      <td>{formatted(o.total)}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${statusStyle[o.status]}`}
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

          {panel === "usuarios" && (
            <div>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>USUÁRIOS</div>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>NOME</th>
                    <th>EMAIL</th>
                    <th>PERFIL</th>
                    <th>CADASTRO</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${u.role === "ADMIN" ? styles.statusAdmin : styles.statusActive}`}
                        >
                          {u.role === "ADMIN" ? "ADMIN" : "CLIENTE"}
                        </span>
                      </td>
                      <td>
                        {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleToggleAdmin(u.id, u.role)}
                        >
                          {u.role === "ADMIN"
                            ? "TORNAR CLIENTE"
                            : "TORNAR ADMIN"}
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionDel}`}
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          REMOVER
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PRODUTOS */}
          {panel === "produtos" && (
            <div>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>PRODUTOS</div>
                <button
                  className={styles.addBtn}
                  onClick={() => {
                    setEditProduct(null);
                    setProductForm({
                      name: "",
                      slug: "",
                      description: "",
                      price: "",
                      stock: "",
                      imageUrl: "",
                      active: true,
                      categoryId: "",
                    });
                    setShowProductForm(true);
                  }}
                >
                  + NOVO PRODUTO
                </button>
              </div>

              {showProductForm && (
                <div className={styles.formCard}>
                  <div className={styles.formTitle}>
                    {editProduct ? "EDITAR PRODUTO" : "NOVO PRODUTO"}
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>NOME</div>
                      <input
                        className={styles.fieldInput}
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>SLUG</div>
                      <input
                        className={styles.fieldInput}
                        value={productForm.slug}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            slug: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>PREÇO (R$)</div>
                      <input
                        className={styles.fieldInput}
                        type="number"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>ESTOQUE</div>
                      <input
                        className={styles.fieldInput}
                        type="number"
                        min="1"
                        value={productForm.stock}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val < 1) return;
                          setProductForm({ ...productForm, stock: val });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>CATEGORIA</div>
                      <select
                        className={styles.fieldInput}
                        value={productForm.categoryId}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            categoryId: e.target.value,
                          })
                        }
                      >
                        <option value="">Selecione</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>
                        IMAGEM DO PRODUTO *
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.fieldInput}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          // Reduz a imagem antes de enviar
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => {
                              const canvas = document.createElement("canvas");
                              const maxSize = 800;
                              let width = img.width;
                              let height = img.height;

                              if (width > height && width > maxSize) {
                                height = (height * maxSize) / width;
                                width = maxSize;
                              } else if (height > maxSize) {
                                width = (width * maxSize) / height;
                                height = maxSize;
                              }

                              canvas.width = width;
                              canvas.height = height;
                              canvas
                                .getContext("2d")
                                .drawImage(img, 0, 0, width, height);

                              const compressed = canvas.toDataURL(
                                "image/jpeg",
                                0.7,
                              );
                              setProductForm({
                                ...productForm,
                                imageUrl: compressed,
                              });
                            };
                            img.src = event.target.result;
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {productForm.imageUrl && (
                        <img
                          src={productForm.imageUrl}
                          alt="preview"
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            marginTop: 8,
                            border: "0.5px solid #e8e0d4",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className={styles.field} style={{ marginTop: 12 }}>
                    <div className={styles.fieldLabel}>DESCRIÇÃO</div>
                    <textarea
                      className={styles.fieldInput}
                      rows={3}
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.formActions}>
                    <label className={styles.checkLabel}>
                      <input
                        type="checkbox"
                        checked={productForm.active}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            active: e.target.checked,
                          })
                        }
                      />{" "}
                      PRODUTO ATIVO
                    </label>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => setShowProductForm(false)}
                      >
                        CANCELAR
                      </button>
                      <button
                        className={styles.saveBtn}
                        onClick={handleSaveProduct}
                      >
                        SALVAR
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>NOME</th>
                    <th>CATEGORIA</th>
                    <th>PREÇO</th>
                    <th>ESTOQUE</th>
                    <th>STATUS</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.category?.name}</td>
                      <td>{formatted(p.price)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${p.active ? styles.statusActive : styles.statusInactive}`}
                        >
                          {p.active ? "ATIVO" : "INATIVO"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={styles.actionBtn}
                          onClick={() => openEditProduct(p)}
                        >
                          EDITAR
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionDel}`}
                          onClick={() => handleDeleteProduct(p.id)}
                        >
                          REMOVER
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PEDIDOS */}
          {panel === "pedidos" && (
            <div>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>PEDIDOS</div>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>PEDIDO</th>
                    <th>CLIENTE</th>
                    <th>ITENS</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>DATA</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <>
                      <tr key={o.id}>
                        <td>#{String(o.id).padStart(3, "0")}</td>
                        <td>{o.user?.name}</td>
                        <td>
                          {o.items?.length}{" "}
                          {o.items?.length === 1 ? "item" : "itens"}
                        </td>
                        <td>{formatted(o.total)}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${statusStyle[o.status]}`}
                          >
                            {statusLabel[o.status]}
                          </span>
                        </td>
                        <td>
                          {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                        <td>
                          <button
                            className={styles.actionBtn}
                            onClick={() =>
                              setEditOrder(editOrder?.id === o.id ? null : o)
                            }
                          >
                            {editOrder?.id === o.id ? "FECHAR" : "GERENCIAR"}
                          </button>
                        </td>
                      </tr>
                      {editOrder?.id === o.id && (
                        <tr>
                          <td colSpan={7} className={styles.orderDetail}>
                            <div className={styles.orderDetailInner}>
                              <div className={styles.orderItems}>
                                <div
                                  className={styles.fieldLabel}
                                  style={{ marginBottom: 8 }}
                                >
                                  ITENS DO PEDIDO
                                </div>
                                {o.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className={styles.orderItem}
                                  >
                                    <span>{item.product?.name}</span>
                                    <span>Qtd: {item.quantity}</span>
                                    <span>{formatted(item.price)}</span>
                                  </div>
                                ))}
                              </div>
                              <div>
                                <div
                                  className={styles.fieldLabel}
                                  style={{ marginBottom: 8 }}
                                >
                                  ATUALIZAR STATUS
                                </div>
                                <div className={styles.statusBtns}>
                                  {[
                                    "PENDING",
                                    "PAID",
                                    "SHIPPED",
                                    "DELIVERED",
                                    "CANCELLED",
                                  ].map((s) => (
                                    <button
                                      key={s}
                                      className={`${styles.statusBtn} ${o.status === s ? styles.statusBtnActive : ""}`}
                                      onClick={() => handleUpdateOrder(o.id, s)}
                                    >
                                      {statusLabel[s]}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CATEGORIAS */}
          {panel === "categorias" && (
            <div>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>CATEGORIAS</div>
                <button
                  className={styles.addBtn}
                  onClick={() => {
                    setEditCategory(null);
                    setCategoryForm({ name: "", slug: "" });
                    setShowCategoryForm(true);
                  }}
                >
                  + NOVA CATEGORIA
                </button>
              </div>

              {showCategoryForm && (
                <div className={styles.formCard}>
                  <div className={styles.formTitle}>
                    {editCategory ? "EDITAR CATEGORIA" : "NOVA CATEGORIA"}
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>NOME</div>
                      <input
                        className={styles.fieldInput}
                        value={categoryForm.name}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>SLUG (opcional)</div>
                      <input
                        className={styles.fieldInput}
                        value={categoryForm.slug}
                        placeholder="gerado automaticamente"
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            slug: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>
                        IMAGEM — SELECIONE UM PRODUTO
                      </div>
                      <select
                        className={styles.fieldInput}
                        value={categoryForm.imageUrl}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            imageUrl: e.target.value,
                          })
                        }
                      >
                        <option value="">Sem imagem</option>
                        {products
                          .filter((p) => p.imageUrl)
                          .map((p) => (
                            <option key={p.id} value={p.imageUrl}>
                              {p.name}
                            </option>
                          ))}
                      </select>
                      {categoryForm.imageUrl && (
                        <img
                          src={categoryForm.imageUrl}
                          alt="preview"
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            marginTop: 8,
                            border: "0.5px solid #e8e0d4",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <div />
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => setShowCategoryForm(false)}
                      >
                        CANCELAR
                      </button>
                      <button
                        className={styles.saveBtn}
                        onClick={handleSaveCategory}
                      >
                        SALVAR
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>NOME</th>
                    <th>SLUG</th>
                    <th>PRODUTOS</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.slug}</td>
                      <td>{c._count?.products || 0}</td>
                      <td>
                        <button
                          className={styles.actionBtn}
                          onClick={() => {
                            setEditCategory(c);
                            setCategoryForm({
                              name: c.name,
                              slug: c.slug,
                              imageUrl: c.imageUrl || "",
                            });
                            setShowCategoryForm(true);
                          }}
                        >
                          EDITAR
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionDel}`}
                          onClick={() => handleDeleteCategory(c.id)}
                        >
                          REMOVER
                        </button>
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
  const prisma = (await import("../../services/prisma")).default;

  try {
    const token = getCookie("authorization", { req, res });
    if (!token) throw new Error("No token");
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: { id: true, name: true, email: true, role: true },
    });
    if (user.role !== "ADMIN") throw new Error("Not admin");
    return { props: { user: JSON.parse(JSON.stringify(user)) } };
  } catch {
    return { redirect: { destination: "/login", permanent: false }, props: {} };
  }
};
