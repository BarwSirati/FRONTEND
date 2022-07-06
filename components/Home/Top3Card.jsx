import React from "react";
import PlanetImageSwitch from "../PlanetImageSwitch";
import Image from "next/image";
import { useGetTopRankQuery } from "../../hooks/api/user/userSlice";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";
const Top3Card = ({ token }) => {
  const router = useRouter();
  const {
    isSuccess,
    data = [],
    isError,
    isFetching,
  } = useGetTopRankQuery(token);
  if (isError) {
    deleteCookie("token");
    router.push("/login");
  }
  return (
    <>
      {data.length === 0 ? (
        <div className="card md:w-96 lg:-my-16 mt-10 bg-base-100 shadow-xl mx-auto">
          <div className="card-body ">
            <h2 className="card-title text-2xl text-white justify-center">
              No Data Contents
            </h2>
          </div>
        </div>
      ) : isFetching ? (
        <div className="card md:w-96 lg:-my-16 mt-10 bg-[#2A303C] shadow-xl mx-auto">
          <div className="card-body ">
            <h2 className="card-title text-2xl text-white justify-center">
              Loading
            </h2>
          </div>
        </div>
      ) : (
        isSuccess && (
          <div className="grid lg:grid-cols-3 justify-items-center  text-center">
            {data.map((user, key) => {
              return (
                <div
                  key={key}
                  className="card md:w-96 lg:-my-40 my-5 bg-[#2A303C] shadow-xl"
                >
                  <figure
                    className={`${
                      user.group === 5 ? "md:w-96 my-3" : "w-48"
                    }  mx-auto`}
                  >
                    <Image src={PlanetImageSwitch(user.group)} alt="profile" />
                  </figure>
                  <div className="card-body text-center items-center">
                    <h2 className="card-title text-2xl text-success">
                      {user.name}
                    </h2>
                    <div className="flex space-x-5">
                     
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </>
  );
};

export default Top3Card;
