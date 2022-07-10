import {useDispatch} from "react-redux";
import React, {useEffect} from "react";
import {setCredentials} from "../hooks/api/auth/authSlice";
import Layout from "../components/Layout";
import {getCookie} from "cookies-next";
import axios from "axios";

const Guide = ({token, user}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if(user) {
      dispatch(setCredentials(user));
    }
  }, [dispatch, user]);
  return (
    <Layout>
      <div>
        Guide
      </div>
    </Layout>
  );
};

export const getServerSideProps = async({req, res}) => {
  const isAuth = getCookie("token", {req, res});
  if(!isAuth) {
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
  if(response.status !== 200) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
  const user = response.data;
  return {props: {token, user}};
};

export default Guide;
