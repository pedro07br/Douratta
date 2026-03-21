import { getCookie } from "cookies-next";
import { verifyToken } from "../services/auth";

export default function Home() {
  return <div>Home</div>;
}

export const getServerSideProps = async ({ req, res }) => {
  try {
    const token = getCookie("authorization", { req, res });
    if (!token) throw new Error("No token found");

    verifyToken(token);
    return {
      props: {}
    };

  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      },
      props: {}
    };
  }
};