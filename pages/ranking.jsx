import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { setCredentials } from "../hooks/api/auth/authSlice";
import Table from "../components/Ranking/Table";
import jwtDecode from "jwt-decode";

const Ranking = ({ token, user }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(setCredentials(user));
    }
  }, [dispatch, user]);
  return (
    <Layout>
      <div className="text-center">
        <h1 className="md:text-4xl text-2xl font-bold text-success drop-shadow-lg">
          Ranking
        </h1>
      </div>
      <Table token={token} />
    </Layout>
  );
};

export const getServerSideProps = ({ req, res }) => {
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
  const user = jwtDecode(isAuth);
  return { props: { token, user } };
};
export default Ranking;
