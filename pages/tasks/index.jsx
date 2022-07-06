import React, { Fragment, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Loading from "../../components/Loading";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../hooks/api/auth/authSlice";
import { useGetQuestionsQuery } from "../../hooks/api/question/questionSlice";
import jwtDecode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faMeteor,
  faCaretRight,
  faCaretLeft,
} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import axios from "axios";
const Tasks = ({ token, user }) => {
  const { isSuccess, data = [] } = useGetQuestionsQuery(token);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      setQuestions(data);
    }
  }, [data, isSuccess]);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [complete, setComplete] = useState("");
  const [search, setSearch] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const questionsPerPage = 9;
  const pagesVisited = pageNumber * questionsPerPage;
  const displayQuestion = questions.slice(
    pagesVisited,
    pagesVisited + questionsPerPage
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(setCredentials(user));
    }
  }, [dispatch, user]);
  const searchName = async (e) => {
    e.preventDefault();
    setName(e.target.value);
    setSearch(true);
  };

  const filterUnit = async (e) => {
    e.preventDefault();
    setUnit(e.target.value);
    setSearch(true);
  };
  const filterComplete = async (e) => {
    e.preventDefault();
    setComplete(e.target.value);
    setSearch(true);
  };

  if (search) {
    if (name) {
      setQuestions(
        data.filter((ques) =>
          ques.title.toLowerCase().includes(name.toLowerCase())
        )
      );
    } else {
      let paramsData = {};
      if (unit != "" && complete != "") {
        paramsData = {
          unit: unit,
          complete: complete,
        };
      } else if (unit != "") {
        paramsData = {
          unit: unit,
        };
      } else if (complete != "") {
        paramsData = {
          complete: complete,
        };
      }
      const query = async () => {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND}/question/search`,
          {
            params: paramsData,
            headers: {
              Authorization: token,
            },
          }
        );
        setQuestions(res.data);
      };
      query();
    }
    setSearch(false);
  }
  const renderStar = (rank) => {
    if (!rank) {
      return (
        <Fragment>
          <FontAwesomeIcon icon={faMeteor} className="text-red-600 text-3xl" />
        </Fragment>
      );
    } else if (rank < 4) {
      let star = [];
      for (let i = 0; i < rank; i++) {
        star.push(
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className="text-warning text-3xl"
          />
        );
      }
      return star;
    } else if (rank > 3) {
      let star = [];
      for (let i = 0; i < rank - 3; i++) {
        star.push(
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className="text-red-600 text-3xl"
          />
        );
      }
      return star;
    }
  };
  return isSuccess ? (
    <Layout>
      <div className="md:space-x-4 bg-primary md:space-y-0 space-y-3 rounded-lg p-2 text-white md:flex">
        <div>
          <input
            type="text"
            name=""
            id=""
            className="rounded-md p-2 w-full focus:outline-none bg-purple-search bg-opacity-50"
            placeholder="Search Name"
            onChange={searchName}
          />
        </div>

        <div>
          <select
            name="unit"
            className="rounded-md p-2 w-full focus:outline-none bg-purple-search bg-opacity-50"
            onChange={filterUnit}
          >
            <option value="">All Unit</option>
            <option value="Basic I/O">Basic I/O</option>
            <option value="If-Else">If-Else</option>
            <option value="Loop">Loop</option>
            <option value="Array">Array</option>
            <option value="Pattern">Pattern</option>
            <option value="Reverse Engineer">Reverse Engineer</option>
            <option value="CTF">CTF</option>
          </select>
        </div>
        <div className="flex">
          <select
            name="complete"
            className="rounded-md p-2  w-full focus:outline-none bg-purple-search bg-opacity-50"
            onChange={filterComplete}
          >
            <option value="">Status</option>
            <option value="true">Complete</option>
            <option value="false">Uncomplete</option>
          </select>
        </div>
      </div>
      <div className="card w-full bg-[#1D222A] shadow-xl mt-6 mb-2 rounded-md text-white">
        <div className="rounded-t-md bg-primary p-1 text-center text-2xl font-bold">
          Mission
        </div>
        <div className="md:grid md:grid-cols-3 md:gap-6 p-5 md:space-y-0 space-y-4">
          {displayQuestion.map((ques, key) => {
            return (
              <Link key={key} href={`/tasks/${ques._id}`}>
                <div
                  className={`card w-full ${
                    ques.result != "" && !ques.status
                      ? "bg-red-600"
                      : ques.status
                      ? "bg-lime-600"
                      : "bg-[#2A303C]"
                  }  shadow-xl cursor-pointer hover:scale-105  transition-all`}
                >
                  <div className="card-body text-center font-semibold text-md">
                    <h2 className="prompt text-xl">{ques.title}</h2>
                    <p className="prompt">{ques.unit}</p>
                    <div className="flex w-full justify-center space-x-2">
                      {renderStar(ques.rank)}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {isSuccess && (
          <div className="text-2xl pb-4">
            <ReactPaginate
              className="flex space-x-10 justify-center"
              pageClassName="hover:text-success text-white"
              breakLabel="..."
              previousLabel={<FontAwesomeIcon icon={faCaretLeft} />}
              nextLabel={<FontAwesomeIcon icon={faCaretRight} />}
              pageCount={Math.ceil(questions.length / questionsPerPage)}
              onPageChange={({ selected }) => {
                setPageNumber(selected);
              }}
              activeClassName={"text-success"}
              pageRangeDisplayed={2}
              renderOnZeroPageCount={null}
              nextClassName={"hover:text-success text-white"}
              previousClassName={"hover:text-success text-white"}
            />
          </div>
        )}
      </div>
    </Layout>
  ) : (
    <Loading />
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
export default Tasks;
