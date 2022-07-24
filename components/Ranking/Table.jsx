import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretLeft, faCaretRight,} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import PlanetImageSwitch from "../PlanetImageSwitch";
import {useGetRankingQuery} from "../../hooks/api/user/userSlice";
import Image from "next/image";
import {deleteCookie} from "cookies-next";
import {useRouter} from "next/router";

const Table = ({token}) => {
  const router = useRouter();
  const {
    isLoading,
    isSuccess,
    data = [],
    isError,
  } = useGetRankingQuery(token);
  if(isError) {
    router.push("/login");
    deleteCookie("token");
  }
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const displayUsers = data.slice(pagesVisited, pagesVisited + usersPerPage);

  const resetAnimation = () => {
    const rankRows = document.querySelectorAll(".rank-row");
    rankRows.forEach((element) => {
      element.style.animation = "none";
      element.offsetHeight;
      element.style.animation = null;
    });
  };

  return (
    <div className="ranking">
      <div className="ranking-wrapper">
        <div className="ranking-grid">
          <table className="ranking-table">
            <thead>
            <tr className="bg-slate-700 z-50 sticky top-0 text-base md:text-xl text-white">
              <th className="col-rank py-2">RANK</th>
              <th className="col-group">GROUP</th>
              <th className="col-name text-start">NAME</th>
              <th className="col-finished">COMPLETED</th>
              <th className="col-score text-end pr-10">SCORE</th>
            </tr>
            </thead>
            <tbody>
            {isLoading ? (
              <tr className="text-center">
                <th className="text-3xl py-5" colSpan="5">
                  Loading...
                </th>
              </tr>
            ) : displayUsers.length === 0 ? (
              <tr className="text-center">
                <th className="text-3xl py-5" colSpan="5">
                  No Data Contents
                </th>
              </tr>
            ) : (
              isSuccess &&
              displayUsers.map((user, key) => {
                return (
                  <tr className="rank-row" key={key}>
                    <td className={`col-rank ${user.num === "UNRANKED" ? "na" : ""}`}>{user.num === "UNRANKED" ? "N/A" : user.num}</td>
                    <td className="col-group">
                      <Image
                        src={PlanetImageSwitch(user.group)}
                        className={`mx-auto`}
                        width={150}
                        height={82.5}
                        alt="planet"
                      />
                    </td>
                    <td className="col-name">
                      <div className="font-bold">{user.name}</div>
                    </td>
                    <td className="col-finished">{user.finished}</td>
                    <td className="col-score">{user.score}<span className="point">PT</span></td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>
      {isSuccess && (
        <div className="pagination">
          <ReactPaginate
            className="paginate"
            pageClassName="paginate-item"
            breakLabel="..."
            previousLabel={<FontAwesomeIcon icon={faCaretLeft}/>}
            nextLabel={<FontAwesomeIcon icon={faCaretRight}/>}
            pageCount={Math.ceil(data.length / usersPerPage)}
            onPageChange={({selected}) => {
              setPageNumber(selected);
              resetAnimation();
            }}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            activeClassName={"active"}
            renderOnZeroPageCount={null}
            nextClassName={"paginate-arrow"}
            previousClassName={"paginate-arrow"}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
