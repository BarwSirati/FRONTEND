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
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import axios from "axios";
const Tasks = ({ token, user }) => {
  const { isSuccess, isFetching, data = [] } = useGetQuestionsQuery(token);
  const [questions, setQuestions] = useState([]);
  const [complete, setComplete] = useState("all");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");

  const [search, setSearch] = useState(false);
  useEffect(() => {
    if (isSuccess && complete == "all" && name == "") {
      setQuestions(data);
    }
  }, [complete, data, isSuccess, name]);

  const [reset, setReset] = useState(true);
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
    await resetAnimation();
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

  const resetAnimation = () => {
    const taskCards = document.querySelectorAll(".task-card");
    const taskStars = document.querySelectorAll(".task-star");

    taskCards.forEach((element) => {
      element.style.animation = "none";
      element.offsetHeight;
      element.style.animation = null;
    });
    taskStars.forEach((element) => {
      element.style.animation = "none";
      element.offsetHeight;
      element.style.animation = null;
    });
  };
  if (search) {
    const filter = data.filter(
      (ques) =>
        ques.title.toLowerCase().includes(name.toLowerCase()) &&
        ques.unit.includes(unit) &&
        ques.status.toString() == complete
    );
    setQuestions(filter);
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

  const handleClick = (event) => {
    event.currentTarget.classList.add("clicked");
    event.currentTarget.style.animation = "none";
    event.currentTarget.offsetHeight;
    event.currentTarget.style.animation = null;
  };
  const ribbonHandler = (ques) => {
    if (ques.result !== "" && !ques.status) {
      return <div className="ribbon orange">In Progress...</div>;
    } else if (ques.status) return <div className="ribbon green">Complete</div>;
    else return <div className="ribbon gray">Incomplete</div>;
  };
  return (
    <Layout>
      <div className="task-wrapper">
        <div className="task-search">
          <select
            name="unit"
            className="search-input md:shrink"
            onChange={filterUnit}
            onInput={handleClick}
          >
            <option value="">All Units</option>
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
            onInput={handleClick}
          >
            <option value="all">All Status</option>
            <option value="true">Complete</option>
            <option value="false">Incomplete</option>
          </select>
          <div className="grow">
            <div className="search-icon">
              <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            </div>
            <input
              type="text"
              name=""
              id=""
              className="w-full search-input search bai-jamjuree font-semibold"
              placeholder="Question Name"
              onChange={searchName}
            />
          </div>
        </div>

        <div className="task-grid">
          {displayQuestion.map((ques, key) => {
            return (
              <Link key={key} href={`/tasks/${ques._id}`}>
                <div
                  onClick={handleClick}
                  className={`task-card ${ques.status ? "complete" : ""}`}
                >
                  {ribbonHandler(ques)}
                  <div className="task-star">{renderStar(ques.rank)}</div>
                  <div className="contain">
                    <h2 className="head overflow-hidden text-ellipsis whitespace-pre">
                      {ques.title}
                    </h2>
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
                resetAnimation();
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
  );
};
export const getServerSideProps = async ({ req, res }) => {
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
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND}/users/current/info`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  if (response.status !== 200) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
  const user = response.data;
  return { props: { token, user } };
};
export default Tasks;
