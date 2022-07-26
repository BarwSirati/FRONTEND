import React, {Fragment, useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import Layout from "../../components/Layout";
import {useDispatch} from "react-redux";
import {setCredentials} from "../../hooks/api/auth/authSlice";
import {useGetQuestionsQuery} from "../../hooks/api/question/questionSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretLeft, faCaretRight, faCircleExclamation, faMeteor, faSearch, faStar} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import axios from "axios";
import CustomLink from "../../components/CustomLink";
import * as regular from "@fortawesome/free-regular-svg-icons";

const Tasks = ({token, user}) => {
  const {isSuccess, isFetching, data = []} = useGetQuestionsQuery(token);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if(isSuccess) {
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
    if(user) {
      dispatch(setCredentials(user));
    }
  }, [dispatch, user]);
  const searchName = async(e) => {
    e.preventDefault();
    setName(e.target.value);
    setSearch(true);
    await resetAnimation();
  };

  const filterUnit = async(e) => {
    e.preventDefault();
    setUnit(e.target.value);
    setSearch(true);
  };
  const filterComplete = async(e) => {
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
  if(search) {
    let filter = data.filter((ques) =>
      ques.title.toLowerCase().includes(name.toLowerCase())
    );

    if(unit != "") {
      filter = filter.filter((ques) => ques.unit.includes(unit));
    }

    if(complete != "") {
      filter = filter.filter((ques) => ques.status.toString() == complete);
    }

    setQuestions(filter);
    setSearch(false);
    resetAnimation();
  }
  const renderStar = (rank) => {
    if(!rank) {
      return (
        <Fragment>
          <div className="tooltip tooltip-left result" data-tip="Extra task - No point">
            <FontAwesomeIcon icon={regular.faStar} className="text-sky-400 text-xl lg:text-3xl"/>
          </div>
        </Fragment>
      );
    }
    else if(rank < 4) {
      let text;
      if(rank === 1) text = "Baby - 100 points";
      else if(rank === 2) text = "Easy - 200 points";
      else text = "Normal - 300 points";

      let stars = [];
      for(let i = 0; i < rank; i++)
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className="text-yellow-400 text-xl lg:text-3xl"
          />
        );

      return (
        <div className="tooltip tooltip-left result" data-tip={`${text}`}>
          {stars}
        </div>
      );
    }
    else if(rank > 3) {
      let text;
      if(rank === 4) text = "Hard - 400 points";
      else if(rank === 5) text = "Extreme - 500 points";
      else text = "God - 600 points";

      let stars = [];
      for(let i = 0; i < rank - 3; i++)
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faMeteor}
            className="text-rose-500 text-xl lg:text-3xl"
          />
        );

      return (
        <div className="tooltip tooltip-left result" data-tip={`${text}`}>
          {stars}
        </div>
      );
    }
  };

  const handleClick = (event) => {
    event.currentTarget.classList.add("clicked");
    event.currentTarget.style.animation = "none";
    event.currentTarget.offsetHeight;
    event.currentTarget.style.animation = null;
  };
  const handleTaskCardClick = (event) => {
    handleClick(event);
  }
  const ribbonHandler = (ques) => {
    if(ques.result !== "" && !ques.status) {
      return <div className="ribbon orange">In Progress...</div>;
    }
    else if(ques.status) return <div className="ribbon green">Complete</div>;
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
            <option value="">All Status</option>
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

        {(questions.length === 0 && !isFetching)
          ? (<div className="task-grid-notfound">
              <h1>
                <FontAwesomeIcon icon={faCircleExclamation}></FontAwesomeIcon>
                <div>Data not found :(</div>
              </h1>
            </div>
          )
          : (<div className="task-grid">
            <div className="wrapper">
              {displayQuestion.map((ques, key) => {
                return (
                  <CustomLink key={key} href={`/tasks/${ques._id}`}>
                    <div
                      onClick={handleTaskCardClick}
                      className={`task-card ${ques.status ? "complete" : ""}`}
                    >
                      {ribbonHandler(ques)}
                      <div className="task-star">{renderStar(ques.rank)}</div>
                      <div className="contain">
                        <h2 className="head overflow-hidden text-ellipsis whitespace-pre">
                          {ques.title}
                        </h2>
                        <p className="unit overflow-hidden text-ellipsis whitespace-pre">{ques.unit}</p>
                      </div>
                    </div>
                  </CustomLink>
                )
              })}
            </div>
          </div>)
        }
      </div>
      {isSuccess && (
        <div className="pagination">
          <ReactPaginate
            className="paginate"
            pageClassName="paginate-item"
            breakLabel="..."
            previousLabel={<FontAwesomeIcon icon={faCaretLeft}/>}
            nextLabel={<FontAwesomeIcon icon={faCaretRight}/>}
            pageCount={Math.ceil(questions.length / questionsPerPage)}
            onPageChange={({selected}) => {
              setPageNumber(selected);
              resetAnimation();
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
    </Layout>
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
export default Tasks;
