import Layout from "../components/layouts/basic";

import { useRouter } from "next/router";
import Link from "next/link";

import LoginForm from "../components/widgets/loginForm";

import { Button } from "react-bootstrap";

// main app function
export default function Main() {
  // get the destination url
  const router = useRouter();
  let { destination_url } = router.query;

  if (destination_url == undefined) {
    destination_url = "/";
  }

  return (
    <Layout title="Login">
      <main className="d-flex h-100">
        <div className="form-signin w-100 m-auto">
          <div className="text-center mb-3 ">
            <h1 className="fw-normal mb-0">Please Login</h1>

            <Link href={`/register?destination_url=${encodeURIComponent(destination_url)}`} passHref>
              <Button variant="link">Register Account</Button>
            </Link>
          </div>

          {/* Load the form component */}
          <LoginForm employee={false} />
        </div>
      </main>
    </Layout>
  );
}
