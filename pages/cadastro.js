import { useState } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

import Link from "next/link";
import Input from "../src/components/input/input";
import Button from "../src/components/Button/Button";
import styles from "../src/components/LoginCard/loginCard.module.css";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFormEdit = (event, name) => {
    setFormData({
      ...formData,
      [name]: event.target.value,
    });
  };

  const handleForm = async (event) => {
  try {
    event.preventDefault();
    const response = await fetch("/api/user/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const json = await response.json();

    if (response.status !== 201) throw new Error(json.message);

    setCookie("authorization", json);
    router.push("/");
  } catch (error) {
    setError(error.message);
  }
};

  return (
    <section className={styles.section}>
      <form onSubmit={handleForm} className={styles.loginBox}>
        <h2 className={styles.title}>Register</h2>

        <Input
          type="text"
          label="Full Name"
          icon="person"
          required
          value={formData.name}
          onChange={(e) => handleFormEdit(e, "name")}
        />
        <Input
          type="email"
          label="Email"
          icon="mail"
          required
          value={formData.email}
          onChange={(e) => handleFormEdit(e, "email")}
        />
        <Input
          type="password"
          label="Password"
          icon="lock-closed"
          required
          value={formData.password}
          onChange={(e) => handleFormEdit(e, "password")}
        />
        <Input
          type="password"
          label="Confirm Password"
          icon="lock-closed"
          required
          value={formData.confirmPassword}
          onChange={(e) => handleFormEdit(e, "confirmPassword")}
        />

        <div className={styles.rememberForgot}>
          <label>
            <input type="checkbox" /> I agree to the terms
          </label>
        </div>

        <Button type="submit">Register</Button>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.registerLink}>
          <p>
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </div>
      </form>
    </section>
  );
}
