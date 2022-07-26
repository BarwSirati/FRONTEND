import React, {useEffect, useState} from "react";
import Layout from "../components/Layout";
import {deleteCookie, getCookie} from "cookies-next";
import {useDispatch} from "react-redux";
import axios from "axios";
import {setCredentials} from "../hooks/api/auth/authSlice";
import PlanetImageSwitch from "../components/PlanetImageSwitch";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faUser, faXmark,} from "@fortawesome/free-solid-svg-icons";
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
      payload[key].substring(0, 32);
      const usernameDoesntChange = key === "username" && payload[key] === user.username;
      const nicknameDoesntChange = key === "name" && payload[key] === user.name;
      const fieldEmpty = payload[key] === "";
      if(usernameDoesntChange || nicknameDoesntChange || fieldEmpty) {
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
  const reloadPage = () => {
    const taskCards = document.querySelectorAll(".redirecting-overlay");
    taskCards.forEach((element) => {
      element.classList.add('active');
    });
  };
  useEffect(() => {
    if(reload) {
      reloadPage();
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
        <div className="profile-wrapper">
          <div className="profile-half">
            <div className="profile-card">
              <div className="profile">
                <h1>Profile</h1>

                <figure className="mx-auto w-full">
                  <Image src={PlanetImageSwitch(user.group)} alt="profile"/>
                </figure>

                <div className="username-wrapper">
                  <div className="flex flex-row">
                    <h2 className="head">Username</h2>
                    <div className="content">
                      {user.username}
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <h2 className="head">Nickname</h2>
                    <div className="content">
                      {user.name}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button onClick={() => setIsOpen(true)}>EDIT PROFILE</button>
              </div>
            </div>
          </div>
          <div className="score-half">
            <div className="rank-card">
              <h1>Your Rank</h1>
              <div className="w-full text-center prompt text-white text-[80px]">
                {user.rank === "UNRANKED" ? (<div className="text-slate-500">N/A</div>) : (<div><span className="text-slate-500">#</span>{user.rank}</div>)}
              </div>
            </div>
            <div className="score-card">
              <h1>Your Score</h1>
              <div className="md:pt-4 w-full text-end prompt text-white text-4xl md:text-[80px]">
                {user.score}.
                <span className="text-slate-500 text-xl md:text-[40px]">00</span>
              </div>
            </div>

            <div className="progress-card">
              <h1>Progress</h1>
              <div>
                <div className="custom-progress">
                  <div className="custom-progress-bar" style={{"--progress": Math.round(user.progress) + "%"}}></div>
                  <div className="right-[10px] absolute text-end text-white text-xl prompt font-semibold">{Math.round(user.progress)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-modal">
          <div className={`modal ${isOpen ? "modal-open" : ""} transition-all`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="body mitr">
                <h3>Edit Profile</h3>
                <div className="profile-form">
                  <div>
                    <label>Username</label>
                    <input
                      type="text"
                      placeholder="Username"
                      name="username"
                      defaultValue={user.username}
                      autoComplete="off"
                      maxLength="32"
                      {...register("username")}
                    />
                  </div>
                  <div>
                    <label>Nickname</label>
                    <input
                      type="text"
                      placeholder="Nickname"
                      name="name"
                      defaultValue={user.name}
                      autoComplete="off"
                      maxLength="32"
                      {...register("name")}
                    />
                  </div>
                  <div>
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="New Password"
                      autoComplete="new-password"
                      {...register("password")}
                    />
                  </div>
                </div>
                <div className="button-wrapper">
                  <button
                    type="submit"
                    className="save"
                    htmlFor="my-modal"
                  >
                    <FontAwesomeIcon icon={faSave} className="text-xl mr-2 fa-fw"/>Save
                  </button>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-xl mr-2 fa-fw"/>Close
                  </button>
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
