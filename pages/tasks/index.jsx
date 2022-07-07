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
  faMoon,
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
          <FontAwesomeIcon icon={faMeteor} className="text-rose-500 text-3xl" />
        </Fragment>
      );
    } else if (rank < 4) {
      let star = [];
      for (let i = 0; i < rank; i++) {
        star.push(
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className="text-yellow-400 text-3xl"
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
            icon={faMoon}
            className="text-sky-500 text-3xl"
          />
        );
      }
      return star;
    }
  };

  const [isActive, setIsActive] = useState(false);

  const handleClick = event => {
    event.currentTarget.classList.add('clicked');
  };
  const ribbonHandler = (ques) => {
    if(ques.result !== "" && !ques.status) {
      return(<div className="ribbon orange">In Progress...</div>);
    } else if(ques.status)
      return (<div className="ribbon green">Complete</div>);
    else
      return (<div className="ribbon gray">Incomplete</div>);
  }

  return isSuccess ? (
    <Layout>
      <div className="task-wrapper">
        <div className="task-search">
          <select
            name="unit"
            className="search-input md:shrink"
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
          <select
            name="complete"
            className="search-input md:shrink"
            onChange={filterComplete}
          >
            <option value="">Status</option>
            <option value="true">Complete</option>
            <option value="false">Incomplete</option>
          </select>
          <input
              type="text"
              name=""
              id=""
              className="search-input grow bai-jamjuree font-semibold"
              placeholder="Search Name"
              onChange={searchName}
          />
        </div>

        <div className="task-grid">
          {displayQuestion.map((ques, key) => {
            return (
              <Link key={key} href={`/tasks/${ques._id}`}>
                <div onClick={handleClick}
                  className={`task-card ${ques.status ? "complete" : ""}`}
                >
                  {ribbonHandler(ques)}
                  <span className="star">
                    {renderStar(ques.rank)}
                  </span>
                  <div className="contain">
                    <h2 className="head overflow-hidden text-ellipsis whitespace-pre">{ques.title}</h2>
                    <p className="unit">{ques.unit}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {isSuccess && (
          <div className="task-pagination">
            <ReactPaginate
              className="task-paginate"
              pageClassName="task-paginate-item"
              breakLabel="..."
              previousLabel={<FontAwesomeIcon icon={faCaretLeft} />}
              nextLabel={<FontAwesomeIcon icon={faCaretRight} />}
              pageCount={Math.ceil(questions.length / questionsPerPage)}
              onPageChange={({ selected }) => {
                setPageNumber(selected);
              }}
              activeClassName={"active"}
              pageRangeDisplayed={2}
              renderOnZeroPageCount={null}
              nextClassName={"task-paginate-arrow"}
              previousClassName={"task-paginate-arrow"}
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
