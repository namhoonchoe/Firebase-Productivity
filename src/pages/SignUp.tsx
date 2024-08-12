import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";

type FormInput = {
  email: string;
  username: string;
  password: string;
  checkPassword: string;
};
export default function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInput>();

  const signUp = async (email: string, password: string) => {
    try {
      const credentials = createUserWithEmailAndPassword(auth, email, password);

      await updateProfile((await credentials).user, {
        displayName: watch("username"),
      });
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };

  const onSubmit = () => signUp(watch("email"), watch("password"));

  return (
    <div className="flex flex-col items-center justify-start mt-20">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-xl self-center">회원 가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="user-name"
                placeholder="username"
                {...register("username", { required: true })}
                required
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: true })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password-again">Password Again</Label>
              <Input
                id="password-again"
                type="password"
                autoComplete="current-password"
                {...register("checkPassword", { required: true })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8  text-center text-sm flex justify-center itmes-center *:text-slate-400">
        <p className=" mr-2"> 이미 계정이 있다면</p>
        <Link to="/auth/signin" className="underline">
          로그인
        </Link>
      </div>
    </div>
  );
}
