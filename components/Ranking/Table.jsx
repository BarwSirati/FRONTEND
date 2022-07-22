import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRankingStar,
  faUserAstronaut,
  faCaretRight,
  faCaretLeft,
  faEarthOceania,
  faCircleCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import PlanetImageSwitch from "../PlanetImageSwitch";
import { useGetRankingQuery } from "../../hooks/api/user/userSlice";
import Image from "next/image";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";

const Table = ({ token }) => {
  const router = useRouter();
  const {
    isLoading,
    isSuccess,
    data = [],
    isError,
  } = useGetRankingQuery(token);
  if (isError) {
    router.push("/login");
    deleteCookie("token");
  }
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 5;
  const pagesVisited = pageNumber * usersPerPage;
  const displayUsers = data.slice(pagesVisited, pagesVisited + usersPerPage);

  return (
    <div className="overflow-x-auto max-w-5xl mt-14 text-white mx-auto">
      <table className="table table-normal w-full">
        <thead>
          <tr className="text-center">
            <th>
              <FontAwesomeIcon
                icon={faRankingStar}
                className="text-xl text-warning"
              />
              <br />
              Rank
            </th>
            <th>
              <FontAwesomeIcon
                icon={faUserAstronaut}
                className="text-xl text-red-logo"
              />
              <br />
              Name
            </th>
            <th>
              <FontAwesomeIcon
                icon={faEarthOceania}
                className="text-xl text-neutral"
              />
              <br />
              Group
            </th>
            <th>
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-xl text-success"
              />
              <br />
              Finished
            </th>
            <th>
              <FontAwesomeIcon icon={faStar} className="text-xl text-warning" />
              <br />
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="text-center">
              <th className="text-2xl" colSpan="5">
                Loading
              </th>
            </tr>
          ) : displayUsers.length === 0 ? (
            <tr className="text-center">
              <th className="text-2xl" colSpan="5">
                No Data Contents
              </th>
            </tr>
          ) : (
            isSuccess &&
            displayUsers.map((user, key) => {
              return (
                <tr className="text-center" key={key}>
                  <td>{user.num}</td>
                  <td>
                    <div className="font-bold">{user.name}</div>
                  </td>
                  <td>
                    <Image
                      src={PlanetImageSwitch(user.group)}
                      className={`mx-auto`}
                      width={user.group === 5 ? 128 : 64}
                      height={80}
                      alt="planet"
                    />
                  </td>
                  <td>{user.finished}</td>
                  <td>{user.score}</td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="5">
            </th>
          </tr>
        </tfoot>
      </table>
      {isSuccess && (
        <div className="pagination">
          <ReactPaginate
            className="paginate"
            pageClassName="paginate-item"
            breakLabel="..."
            previousLabel={<FontAwesomeIcon icon={faCaretLeft} />}
            nextLabel={<FontAwesomeIcon icon={faCaretRight} />}
            pageCount={Math.ceil(data.length / usersPerPage)}
            onPageChange={({ selected }) => {
              setPageNumber(selected);
            }}
            pageRangeDisplayed={99999}
            marginPagesDisplayed={99999}
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
