import { FormEvent, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { OutletContext } from "@/types/outlet-context";
import { Input } from "./ui";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setJwtToken, setAlert }: OutletContext = useOutletContext();

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (email === "admin@example.com") {
      setJwtToken("admin");
      setAlert(null);
      navigate("/");
    } else {
      setAlert({
        title: "Invalid Credentials",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="">
      <h2 className="text-3xl font-medium">Login</h2>

      <hr className="mt-2" />

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-4 flex max-w-[40rem] flex-col gap-2"
      >
        <label htmlFor="email" className="text-slate-600">
          Email
        </label>
        <Input
          title="Email Address"
          name="email"
          type="email"
          value={email}
          placeholder="Enter your email address"
          onChange={(e) => setEmail(e.target.value)}
        />
        <p></p>

        <label htmlFor="password" className="text-slate-600">
          Password
        </label>
        <Input
          title="Password"
          name="password"
          type="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <p></p>

        <button
          type="submit"
          className="h-10 w-full rounded-md bg-blue-500 font-semibold text-white transition-colors duration-300 hover:bg-blue-600 active:scale-[101%]"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
