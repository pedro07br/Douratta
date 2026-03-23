import { getCookie } from "cookies-next";
import { verifyToken } from "../services/auth";

export default function Home() {
  return (
    <main>

      <div>Home</div>

      <h1 className="title">Welcome to the Home Page!</h1>
    </main>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  try {
    const token = getCookie("authorization", { req, res });
    if (!token) throw new Error("No token found");

    verifyToken(token);
    return {
      props: {},
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
};
