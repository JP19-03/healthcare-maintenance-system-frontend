import type { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { SignInFormData } from "../../types";

type LoginFormProps = {
  register: UseFormRegister<SignInFormData>;
  errors: FieldErrors<SignInFormData>;
};

export default function LoginForm({ register, errors }: LoginFormProps) {
  return (
    <>
      <div className="mb-5 space-y-2">
        <label
          htmlFor="username"
          className="text-xs uppercase font-bold text-slate-300 tracking-wider"
        >
          Username
        </label>
        <input
          id="username"
          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
          type="text"
          placeholder="e.g. johan"
          {...register("username", {
            required: "Username is required",
          })}
        />
        {errors.username && (
          <ErrorMessage>{errors.username.message}</ErrorMessage>
        )}
      </div>

      <div className="mb-5 space-y-2">
        <label
          htmlFor="password"
          className="text-xs uppercase font-bold text-slate-300 tracking-wider"
        >
          Password
        </label>
        <input
          id="password"
          className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
          type="password"
          placeholder="••••••••"
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </div>
    </>
  );
}
