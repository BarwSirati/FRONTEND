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
        <div className="wrapper">
          <div className="rank-card-full">
            <h2>No Data Contents</h2>
          </div>
        </div>
      ) : isFetching ? (
        <div className="wrapper">
          <div className="rank-card-full">
            <h2>Loading</h2>
          </div>
        </div>
      ) : (
        isSuccess && (
          <div className="wrapper">
            {data.map((user, key) => {
              return (
                <div
                  key={key}
                  className="rank-card"
                >
                  <div className="ribbon green">Rank {key+1}</div>
                  <figure>
                    <Image src={PlanetImageSwitch(user.group)} alt="profile" />
                  </figure>
                  <h2>
                    {user.name}
                  </h2>
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
