import React, { useEffect } from "react";
import { getCookie } from "cookies-next";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { setCredentials } from "../hooks/api/auth/authSlice";
import jwtDecode from "jwt-decode";
import Planet from "../components/Home/Planet";
import Link from "next/link";
import Top3Card from "../components/Home/Top3Card";
import axios from "axios";

const Home = ({ token, user }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(setCredentials(user));
    }
  }, [dispatch, user]);
  return (
    <Layout>
      <article className="home-header-wrapper">
        <h1>
          <div className="practice">Practice C Programing</div>
          <div className="week">In 1 Week</div>
          <Link href="/tasks">
            <button className="border-2 btn btn-outline btn-success">
              GET START
            </button>
          </Link>
        </h1>
      </article>
      <Planet />
      <article className="home-ranking">
        <h1>Top 3 Ranking</h1>
        <Top3Card token={token} />
      </article>
    </Layout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const isAuth = getCookie("token", { req, res });
  if (!isAuth) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
  const token = `Bearer ` + isAuth;
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND}/users/current/info`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  if (response.status !== 200) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
  const user = response.data;
  return { props: { token, user } };
};

export default Home;
