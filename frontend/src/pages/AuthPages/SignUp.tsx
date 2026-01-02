import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta title="DistroZone | Signup Page" />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
