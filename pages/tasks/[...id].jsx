import React, {useEffect, useState} from "react";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import {setCredentials} from "../../hooks/api/auth/authSlice";
import {useDispatch} from "react-redux";
import {getCookie} from "cookies-next";
import {useGetQuestionQuery} from "../../hooks/api/question/questionSlice";
import {useRouter} from "next/dist/client/router";
import Image from "next/image";
import CodeMirror from "@uiw/react-codemirror";
import {cpp} from "@codemirror/lang-cpp";
import {useCompileCodeMutation} from "../../hooks/api/submit/compileSlice";
import axios from "axios";
import CustomLink from "../../components/CustomLink";

const Submit = ({token, user, questionId, submit}) => {
  const [compileCode] = useCompileCodeMutation();
  const [sourceCode, setSourceCode] = useState(submit.sourceCode);
  const dispatch = useDispatch();
  const router = useRouter();
  const [reload, setReload] = useState(false);
  const {
    data = {},
    isFetching,
    isError,
  } = useGetQuestionQuery({
    token: token,
    questionId: questionId,
  });

  if(isError) {
    router.push("/404");
  }

  useEffect(() => {
    if(user) {
      dispatch(setCredentials(user));
    }
  }, [dispatch, user]);

  let example = [];
  for(const key in data.ex_output) {
    if(data.ex_output[key]) {
      example.push(
        <div key={key} className="wrapper">
          <h3>Case {Number(key) + 1}</h3>
          <code className="code-block">
            <div className="input">
              <h4>
                <div>Input</div>
              </h4>
              <p>{data.ex_input[key] ? data.ex_input[key] : ""}</p>
            </div>
            <hr/>
            <div className="output">
              <h4>
                <div>Output</div>
              </h4>
              <p>{data.ex_output[key]}</p>
            </div>
          </code>
        </div>
      );
    }
  }

  const getHelp = (chr) => {
    switch(chr) {
      case 'C':
        return "Create File Error";
      case 'L':
        return "Library is Banned";
      case 'F':
        return "Function is Banned";
      case 'S':
        return "Syntax Error";
      case 'W':
        return "Testcase Error";
      case 'P':
        return "Pass";
      case 'T':
        return "Timeout";
      case 'O':
        return "Out of Buffer";
      case 'R':
        return "Runtime Error";
      case '-':
        return "Not pass.";
      case 'E':
        return "Error";
      default:
        return "N/A";
    }
  }
  const generateResult = (result) => {
    let ret = [];
    [...result].forEach((chr) => {
      ret.push(<span className={`result tooltip tooltip-bottom`} data-tip={getHelp(chr)}><span className={`monospace text-lg ${chr == 'P' && "text-green-400"}`}>{chr}</span></span>);
    });
    let pass = result.match(/P/g).length;
    let all = result.length;
    ret.push(
      <span className={`monospace text-rose-500 ml-2 ${pass === all ? "text-green-500" : ""}`}>
        [{pass}/{all}]
      </span>
    );
    return ret;
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!sourceCode) {
      return;
    }
    const body = {
      questionId: questionId,
      sourceCode: sourceCode,
    };
    await compileCode({token: token, data: body});
    setReload(true);
  };
  const [count, setCount] = useState(2);
  useEffect(() => {
    if(reload) {
      const interval = setInterval(() => {
        setCount((currentCount) => --currentCount);
      }, 1000);

      count === 0 && router.reload();
      return () => clearInterval(interval);
    }
  }, [count, reload, router]);
  return (
    <Layout>
      <Loading className={reload ? "active" : ""}/>
      <div className="submit-wrapper">
        <div className="submit-problem">
          <div className="head">
            <CustomLink href="/tasks">BACK</CustomLink>
            <span className="author">
              {isFetching ? "Loading..." : "by " + data.issuer}
            </span>
          </div>
          <h1 className="title">{isFetching ? "Loading..." : data.title}</h1>
          <p className="detail">{isFetching ? "Loading..." : data.detail}</p>
          <div className="specification">
            <h2>Specification</h2>
            <div className="table-wrapper">
              <div className="container">
                <div className="row">
                  <div className="head">Input</div>
                  <div className="content">
                    {isFetching ? "Loading..." : data.detail_input}
                  </div>
                </div>
                <div className="row">
                  <div className="head">Output</div>
                  <div className="content">
                    {isFetching ? "Loading..." : data.detail_output}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {example.length !== 0 ? (
            <div className="sample-case">
              <h2>Sample Case</h2>
              {example}
            </div>
          ) : (
            ""
          )}
          {data.note ? (
            <div className="hint">
              <h2>Hint</h2>
              <p>{data.note}</p>
            </div>
          ) : (
            ""
          )}
          {data.image ? (
            <div className="image">
              <h2>Image</h2>
              <br/>
              <div>
                <Image src={data.image} width={200} height={200} alt="image"/>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="submit-code">
          {submit ? (
            submit.status === true ? (
              <div className="ribbon absolute green">Complete</div>
            ) : (
              <div className="ribbon absolute orange">In Progress...</div>
            )
          ) : (
            <div className="ribbon absolute gray">Incomplete</div>
          )}
          <div className="header mt-[35px]">
            <div className="result">
              <h1>RESULT</h1>
              <p
                className={`result-wrapper ${
                  submit ? (submit.status === true ? "success" : "failed") : ""
                }`}
              >
                {submit.result ? generateResult(submit.result) : "N/A"}
              </p>
            </div>
            <div className="finish">
              <h1>FINISHED</h1>
              <p>{isFetching ? "Loading" : data.finished}</p>
            </div>
          </div>
          <form className="code" onSubmit={handleSubmit}>
            <div className="code-editor">
              <CodeMirror
                value={submit.sourceCode ? submit.sourceCode : ""}
                extensions={[cpp()]}
                theme="dark"
                className="whitespace-pre monospace bg-[#2A303C]"
                placeholder={"Write your program..."}
                spellCheck={false}
                onChange={(value) => {
                  setSourceCode(value);
                }}
                aria-label="code"
                autoCorrect="true"
              />
            </div>

            <div className="code-submit">
              <button type="submit" className={!sourceCode ? "disabled" : ""}>SUBMIT</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
export const getServerSideProps = async(context) => {
  const isAuth = getCookie("token", context);

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
  const questionId = context.query.id[0];
  const query = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND}/submit/${questionId}/${user.id}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const submit = query.data;
  return {props: {token, user, questionId, submit}};
};
export default Submit;
