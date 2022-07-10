import React, {useEffect, useState} from "react";
import Layout from "../components/Layout";
import {deleteCookie, getCookie} from "cookies-next";
import {useDispatch} from "react-redux";
import axios from "axios";
import {setCredentials} from "../hooks/api/auth/authSlice";
import ProgressBar from "../components/Profile/ProgressBar";
import PlanetImageSwitch from "../components/PlanetImageSwitch";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faSave, faUser, faXmark,} from "@fortawesome/free-solid-svg-icons";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useUpdateProfileMutation} from "../hooks/api/user/userSlice";
import {useRouter} from "next/dist/client/router";

const schema = yup.object({
  username: yup.string(),
  name: yup.string(),
  password: yup.string(),
});

const Profile = ({token, user}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [updateProfile] = useUpdateProfileMutation();
  const [reload, setReload] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCredentials(user));
  }, [dispatch, user]);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async(payload = {}) => {
    for(const key in payload) {
      if(payload[key] === "") {
        delete payload[key];
      }
    }
    setIsOpen(false);
    if(Object.keys(payload).length > 0) {
      const query = await updateProfile({
        token: token,
        data: payload,
        id: user.id,
      });
      if(query.data !== "") {
        setReload(true);
      }
    }
  };
  const [count, setCount] = useState(1);
  useEffect(() => {
    if(reload) {
      const interval = setInterval(() => {
        setCount((currentCount) => --currentCount);
      }, 1000);

      count === 0 && router.reload();
      return () => clearInterval(interval);
    }
  }, [count, reload, router]);
  return (
    <>
      <Layout>
        <div
          className={`max-w-6xl md:flex flex-row mx-auto font-bold ${
            reload ? "opacity-20" : ""
          }`}
        >
          <div className="md:w-1/2 p-5 text-center text-white">
            <div className="card w-full bg-[#2A303C] shadow-xl">
              <div className="card-body bg-primary p-4 text-2xl">
                <h2>Profile</h2>
              </div>

              <figure
                className={`${
                  user.group === 5 ? "md:w-96 my-3" : "w-48"
                }  mx-auto`}
              >
                <Image src={PlanetImageSwitch(user.group)} alt="profile"/>
              </figure>

              <div className="flex p-5">
                <div className="w-1/2">
                  <h2 className="text-xl">Username</h2>
                  <br/>

                  {user.username}
                </div>
                <div className="w-1/2">
                  <h2 className="text-xl">NickName</h2>
                  <br/>
                  {user.name}
                </div>
              </div>
              <div className="py-4">
                <button
                  className="btn btn-outline px-20"
                  onClick={() => setIsOpen(true)}
                >
                  <FontAwesomeIcon icon={faEdit}/> &nbsp; EDIT
                </button>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-5 text-center text-white">
            <div className="flex-row md:space-y-16 space-y-10">
              <div className="card w-full bg-[#2A303C] shadow-xl mx-auto">
                <div className="card-body bg-primary p-4 text-2xl">
                  <h2>Score</h2>
                </div>
                <div className="flex p-11">
                  <div className="w-1/2 space-y-5 text-success">
                    <h2 className="text-2xl">RANK</h2>
                    <h2 className="text-3xl">{user.rank}</h2>
                  </div>
                  <div className="w-1/2 space-y-5 text-warning">
                    <h2 className="text-2xl">SCORE</h2>
                    <h2 className="text-3xl">{user.score}</h2>
                  </div>
                </div>
              </div>

              <div className="card w-full bg-[#2A303C] shadow-xl mx-auto">
                <div className="card-body bg-primary p-4 text-2xl">
                  <h2>Progress</h2>
                </div>
                <div className="p-6 space-y-6">
                  <h2 className="text-3xl">{user.progress}/100</h2>
                  <ProgressBar value={user.progress}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={`modal ${isOpen ? "modal-open" : ""} transition-all`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-box">
                <h3 className="font-bold text-2xl text-center text-white">
                  <FontAwesomeIcon icon={faUser}/> &nbsp; Your Profile
                </h3>
                <div className="mt-5 space-y-5">
                  <input
                    type="text"
                    placeholder="Change Username"
                    name="username"
                    className="input input-bordered w-full border-primary"
                    {...register("username")}
                  />
                  <input
                    type="text"
                    placeholder="Change Nickname"
                    name="name"
                    className="input input-bordered w-full border-primary"
                    {...register("name")}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Change Password"
                    className="input input-bordered w-full border-primary"
                    {...register("password")}
                  />
                  <div className="w-full flex justify-center space-x-5">
                    <button
                      type="submit"
                      className="btn btn-warning"
                      htmlFor="my-modal"
                    >
                      <FontAwesomeIcon icon={faSave} className="text-xl"/>
                      &nbsp; Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-error"
                      onClick={() => setIsOpen(false)}
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-xl"/>
                      &nbsp; Close
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
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
    deleteCookie("token");
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

export default Profile;
