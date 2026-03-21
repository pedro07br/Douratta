import LoginCard from "../src/components/LoginCard/loginCard";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const json = await response.json();

      if (response.status !== 200) throw new Error(json.message);

      setCookie("authorization", json);
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <LoginCard
      formData={formData}
      error={error}
      onSubmit={handleForm}
      onChange={handleFormEdit}
    />
  );
}