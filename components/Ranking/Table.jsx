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
import { useGetRankingQuery } from "../../hooks/api/users/usersSlice";
import Image from "next/image";

const Table = ({ token }) => {
  const { isLoading, isSuccess, data = [] } = useGetRankingQuery(token);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 5;
  const pagesVisited = pageNumber * usersPerPage;
  const displayUsers = data.slice(pagesVisited, pagesVisited + usersPerPage);

  return (
    <div className="overflow-x-auto max-w-5xl mt-14 text-white mx-auto">
      <table className="table table-normal  w-full">
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
                  <th>{user.num}</th>
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
              {isSuccess && (
                <div className="text-2xl">
                  <ReactPaginate
                    className="flex space-x-10 justify-center"
                    pageClassName="hover:text-warning"
                    breakLabel="..."
                    previousLabel={<FontAwesomeIcon icon={faCaretLeft} />}
                    nextLabel={<FontAwesomeIcon icon={faCaretRight} />}
                    pageCount={Math.ceil(data.length / usersPerPage)}
                    onPageChange={({ selected }) => {
                      setPageNumber(selected);
                    }}
                    activeClassName={"text-warning"}
                    pageRangeDisplayed={2}
                    renderOnZeroPageCount={null}
                    nextClassName={"hover:text-warning"}
                    previousClassName={"hover:text-warning"}
                  />
                </div>
              )}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Table;
