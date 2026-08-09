import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import LoginForm from "../../components/iam/LoginForm";
import type { SignInFormData } from "../../types";
import { useAuth } from "../../context/AuthContext";

export default function LoginView() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues: SignInFormData = {
    username: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message ||
        "Error logging in. Please check your credentials.";
      toast.error(errorMsg);
    },
    onSuccess: () => {
      toast.success("Welcome to the Maintenance System!");
      navigate("/dashboard");
    },
  });

  const handleForm = (formData: SignInFormData) => mutate(formData);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-4 shadow-lg shadow-teal-500/5">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Sign In
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-light">
            Medical Equipment Management & Maintenance System
          </p>
        </div>

        {/* Card Form */}
        <form
          className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl p-8 rounded-2xl"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <LoginForm register={register} errors={errors} />

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-teal-500/20 transition duration-200 uppercase text-sm tracking-wider cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <nav className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="text-teal-400 font-semibold hover:text-teal-300 transition hover:underline"
              >
                Register here
              </Link>
            </p>
          </nav>
        </form>
      </div>
    </div>
  );
}
