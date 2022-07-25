import React, {useEffect} from "react";
import Layout from "../components/Layout";
import {getCookie} from "cookies-next";
import {useDispatch} from "react-redux";
import {setCredentials} from "../hooks/api/auth/authSlice";
import {faMeteor, faStar} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Guide = ({token, user}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if(user) {
      dispatch(setCredentials(user));
    }
  }, [dispatch, user]);
  return (
    <Layout>
      <div className="guide-wrapper">
        <div>
          <h1>Tasks Difficulty</h1>
          <div className="flex flex-row space-x-4 code-block monospace">
            <div className="text-xl text-white flex flex-col space-y-4">
              <div>
                <FontAwesomeIcon icon={faStar} className="text-2xl text-yellow-400 fa-fw mr-4"/>
              </div>
              <div>
                <FontAwesomeIcon icon={faStar} className="text-2xl text-yellow-400"/>
                <FontAwesomeIcon icon={faStar} className="text-2xl text-yellow-400 fa-fw mr-4"/>
              </div>
              <div>
                <FontAwesomeIcon icon={faStar} className="text-2xl text-yellow-400"/>
                <FontAwesomeIcon icon={faStar} className="text-2xl text-yellow-400"/>
                <FontAwesomeIcon icon={faStar} className="text-2xl text-yellow-400 fa-fw mr-4"/>
              </div>
              <div>
                <FontAwesomeIcon icon={faMeteor} className="text-2xl text-rose-500 fa-fw mr-4"/>
              </div>
              <div>
                <FontAwesomeIcon icon={faMeteor} className="text-2xl text-rose-500"/>
                <FontAwesomeIcon icon={faMeteor} className="text-2xl text-rose-500 fa-fw mr-4"/>
              </div>
              <div>
                <FontAwesomeIcon icon={faMeteor} className="text-2xl text-rose-500"/>
                <FontAwesomeIcon icon={faMeteor} className="text-2xl text-rose-500"/>
                <FontAwesomeIcon icon={faMeteor} className="text-2xl text-rose-500 fa-fw mr-4"/>
              </div>
            </div>
            <div className="text-xl text-white flex flex-col space-y-4">
              <div>   Baby == 100 points</div>
              <div>   Easy == 200 points</div>
              <div> Normal == 300 points</div>
              <div>   Hard == 400 points</div>
              <div>Extreme == 500 points</div>
              <div>    God == 600 points</div>
            </div>
          </div>
        </div>
        <div>
          <h1>Testcases Result</h1>
          <div className="code-block monospace testcase-result">
            <div className="text-xl text-white flex flex-row">
              <div>C : Create File Error    </div>
              <div className="text-slate-500">
                # cannot create file from the code. (or is it even exists?)
              </div>
            </div>
            <div className="text-xl text-white flex flex-row">
              <div>L : Library is Banned    </div>
              <div className="text-slate-500">
                # found banned libraries in the code.
              </div>
            </div>
            <div className="text-xl text-white flex flex-row">
              <div>F : Function is Banned   </div>
              <div className="text-slate-500">
                # found banned functions in the code.
              </div>
            </div>
            <div className="text-xl text-white flex flex-row">
              <div>S : Syntax Error         </div>
              <div className="text-slate-500">
                # syntax errors in the code. (did you forgot &#39;;&#39;?)
              </div>
            </div>
            <div className="text-xl text-white flex flex-row">
              <div>W : Testcase Error       </div>
              <div className="text-slate-500">
                # something went wrong with the input function.
              </div>
            </div>
            <div className="text-xl text-white flex flex-row">
              <div>T : Timeout              </div>
              <div className="text-slate-500">
                # the program is taking to long to execute.
              </div>
            </div>
            <div className="text-xl text-white flex flex-row">
              <div>O : Out of Buffer        </div>
              <div className="text-slate-500">
                # the program is taking up all the buffers. (please reserve the memory)
              </div>
            </div>
            <div className="text-xl text-white flex flex-row">
              <div>R : Runtime Error        </div>
              <div className="text-slate-500">
                # the program failed during the runtime.
              </div>
            </div>
            <div className="text-xl text-white flex flex-row">
              <div>E : Error                </div>
              <div className="text-slate-500">
                # we do not know this too. (please send your code to staff)
              </div>
            </div>
            <div className="text-xl text-white flex flex-row">
              <div>P : Pass                 </div>
              <div className="text-slate-500">
                # the code worked out great, congratulation!
              </div>
            </div>
            <div className="text-xl text-white flex flex-row">
              <div>- : Not Pass             </div>
              <div className="text-slate-500">
                # the output is not as expecting, maybe try again?
              </div>
            </div>
            <div className="text-xl text-white flex flex-row">
              <div>H : Hacker               </div>
              <div className="text-slate-500">
                # are you trying to heck? (stop it, get some help)
              </div>
            </div>
          </div>
        </div>
        <div className="mb-12">
          <h1>Textbook</h1>
          <a target="_blank" className="textbook-link" href="https://bit.ly/bookceboostup" rel="noreferrer">CE Boostup Textbook</a>
        </div>
      </div>
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
export default Guide;
