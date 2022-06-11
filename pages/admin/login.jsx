import Layout from "../../components/layouts/basic";

import LoginForm from "../../components/widgets/loginForm";

import { Container } from "react-bootstrap";


// main app function
export default function Main() {
  return (
    <Layout title="Admin Login">
      <main className="d-flex h-100">
        <div className="form-signin w-100 m-auto">
          <div className="text-center">
            <h1 className="mb-3 fw-normal">Please Login (Admin)</h1>
          </div>

          {/* Load the form component */}
          <LoginForm employee={true} />

        </div>
      </main>
    </Layout>
  );
}
