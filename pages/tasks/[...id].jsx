import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { setCredentials } from "../../hooks/api/auth/authSlice";
import { useDispatch } from "react-redux";
import { getCookie } from "cookies-next";
import { useGetCurrentQuery } from "../../hooks/api/user/userSlice";
import { useGetQuestionQuery } from "../../hooks/api/question/questionSlice";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { useCompileCodeMutation } from "../../hooks/api/submit/compileSlice";
import jwtDecode from "jwt-decode";
import axios from "axios";

const Submit = ({ token, userId, questionId, submit }) => {
  const [compileCode] = useCompileCodeMutation();
  const [sourceCode, setSourceCode] = useState();
  const dispatch = useDispatch();
  const router = useRouter();
  const getCurrentQuery = useGetCurrentQuery(token);
  const [reload, setReload] = useState(false);
  const {
    data = {},
    isFetching,
    isError,
    isSuccess
  } = useGetQuestionQuery({
    token: token,
    questionId: questionId,
  });

  if (isError) {
    router.push("/404");
  }

  useEffect(() => {
    if (getCurrentQuery.isSuccess) {
      dispatch(setCredentials(getCurrentQuery.data));
    }
  }, [dispatch, getCurrentQuery.data, getCurrentQuery.isSuccess]);

  let example = [];
  for (const key in data.ex_output) {
    if (data.ex_output[key]) {
      example.push(
        <div key={key} className="mt-5">
          <h1 className="text-secondary">TestCase {Number(key) + 1} : </h1>
          <br />
          <code className="code-block">
            <div className="flex consolas">
              <h1>Input &nbsp;&nbsp;&nbsp;:</h1>
              <p className="ml-2 consolas">
                {data.ex_input[key] ? data.ex_input[key] : ""}
              </p>
            </div>
            <div className="flex consolas">
              <h1>Output :</h1>
              <p className="ml-2 consolas">{data.ex_output[key]}</p>
            </div>
          </code>
        </div>
      );
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      userId: userId,
      questionId: questionId,
      sourceCode: sourceCode,
    };
    await compileCode({ token: token, data: body });
    setReload(true);
  };
  const [count, setCount] = useState(1);
  useEffect(() => {
    if (reload) {
      const interval = setInterval(() => {
        setCount((currentCount) => --currentCount);
      }, 1000);

      count === 0 && router.reload();
      return () => clearInterval(interval);
    }
  }, [count, reload, router]);
  return  !reload ? (
    <Layout>
      <div className="app-body text-white">
        <div className="md:flex flex-row w-full md:space-x-7 md:space-y-0 space-y-5">
          <div className="card md:w-[47%] bg-base-100 shadow-xl rounded-lg">
            <div className="problem-contents md:max-h-[590px] scrollbar">
              <h1 className="text-right prompt font-bold text-warning text-lg">
                {isFetching ? "Loading" : data.issuer}
              </h1>
              <a href={data.pdfLink} target="_blank" rel="noreferrer">
                <h1 className="text-center my-2 text-2xl font-bold prompt text-success">
                  {isFetching ? "Loading" : data.title}
                </h1>
              </a>
              <hr />
              <p className="my-5 indent-10 prompt md:whitespace-pre-wrap">
                {isFetching ? "Loading" : data.detail}
              </p>
              <div>
                <h1 className="text-secondary">Example : </h1>
                <br />
                <div className="relative overflow-x-auto">
                  <table className="tableBorder" width="100%">
                    <thead>
                      <tr>
                        <th className="prompt">Input</th>
                        <th className="prompt">Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-sm">
                        <td>
                          <p className="prompt">
                            {isFetching ? "Loading" : data.detail_input}
                          </p>
                        </td>
                        <td>
                          <p className="prompt">
                            {isFetching ? "Loading" : data.detail_output}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {example}
              {data.image && (
                <div className="mt-5">
                  <h1 className="text-success">Image : </h1>
                  <br />
                  <div className="text-center">
                    <Image
                      src={data.image}
                      width={200}
                      height={200}
                      alt="image"
                    />
                  </div>
                </div>
              )}
              {data.note && (
                <>
                  <h1 className="text-success">Hint : </h1>
                  <p className="indent-10">{data.note ? data.note : "-"}</p>
                </>
              )}
            </div>
          </div>
          <div className="card md:w-[53%] bg-base-100 shadow-xl rounded-lg p-1">
            <div className="p-4 bg-base-100 flex text-center space-x-5">
              <div className="w-1/2 bg-slate-900 p-3 rounded-lg font-bold">
                <h1>RESULT</h1>
                <h1
                  className={`text-2xl ${
                    submit
                      ? submit.status === true
                        ? "text-success"
                        : "text-error"
                      : "-"
                  }`}
                >
                  {submit.result ? submit.result : "-"}
                </h1>
              </div>
              <div className="w-1/2 bg-slate-900 p-3 rounded-lg font-bold">
                <h1>FINISHED</h1>
                <h1 className="text-2xl">
                  {isFetching ? "Loading" : data.finished}
                </h1>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="h-[400px] overflow-y-auto scrollbar my-5">
                <CodeMirror
                  value={submit.sourceCode ? submit.sourceCode : ""}
                  extensions={[cpp()]}
                  theme="dark"
                  className="whitespace-pre "
                  placeholder={"🔥🔥 CODE HERE 🔥🔥"}
                  spellCheck={true}
                  onChange={(value) => {
                    setSourceCode(value);
                  }}
                  aria-label="code"
                />
              </div>
              <div className="p-1 flex">
                <div className="ml-auto space-x-4">
                  <button
                    type="button"
                    className="btn btn-error"
                    onClick={() => router.back()}
                  >
                    BACK
                  </button>
                  <button type="submit" className="btn btn-warning">
                    SUBMIT
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  ) : (
    <Loading />
  );
};
export const getServerSideProps = async (context) => {
  const isAuth = getCookie("token", context);

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
  const userId = jwtDecode(isAuth).id;
  const questionId = context.query.id[0];
  const query = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND}/submit/${questionId}/${userId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const submit = query.data;
  return { props: { token, userId, questionId, submit } };
};
export default Submit;
