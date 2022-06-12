import Layout from "../components/layouts/basic";

import RegisterForm from "../components/widgets/registerForm";

import { Button } from "react-bootstrap";

// main app function
export default function Main() {
  return (
    <Layout title="Login">
      <main className="d-flex h-100">
        <div className="form-signin w-100 m-auto">
          <div className="text-center mb-3 ">
            <h1 className="fw-normal mb-0">Enter Details</h1>
          </div>

          {/* Load the form component */}
          <RegisterForm  />
        </div>
      </main>
    </Layout>
  );
}
