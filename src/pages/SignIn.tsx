import SocialLoginButton from "@/components/ui/SocialLoginButton";
import GoogleIcon from "@/components/svgIcons/google-icon";
import GithubIcon from "@/components/svgIcons/github-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { FirebaseError } from "firebase/app";
import { AuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

type FormInput = {
  email: string;
  password: string;
};

export default function SignIn() {
  const navigate = useNavigate();
  const githubProvider = new GithubAuthProvider()
  const googleAuthProvider = new GoogleAuthProvider()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInput>();

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };

  const socialLogin = async (provider:AuthProvider) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  }

    const onSubmit: SubmitHandler<FormInput> = ({ email, password }) => {
      signIn(email, password);
    };

    return (
      <div className="flex flex-col w-[400px] justify-center min-h-dvh">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl self-center">로그인</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", { required: true })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    비밀번호를 잊어버리셨나요?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password", { required: true })}
                />
              </div>
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
            <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden gap-4 py-8">
              <p className="divider text-sm text-center text-black">
                다른방법으로 로그인
              </p>

              <div className="flex flex-col items-center  w-full gap-4  ">
                <SocialLoginButton
                  providerIcon={<GoogleIcon />}
                  message={"구글 계정으로 시작하기"}
                  onClick={() => socialLogin(googleAuthProvider)}
                />
                <SocialLoginButton
                  providerIcon={<GithubIcon />}
                  message={"깃허브 계정으로 시작하기"}
                  onClick={() => socialLogin(githubProvider)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8  text-center text-sm flex justify-center itmes-center *:text-slate-400">
          <p className=" mr-2"> 아직 계정이 없으시다면</p>
          <Link to="/auth/signup" className="underline">
            회원가입
          </Link>
        </div>
      </div>
    );
  };

