import Layout from "../../components/layouts/basic";

import LoginForm from "../../components/widgets/loginForm";

import { Badge, Container } from "react-bootstrap";


// main app function
export default function Main() {
  return (
    <Layout title="Admin Login">
      <main className="d-flex h-100">
        <div className="form-signin w-100 m-auto">
          <div className="text-center mb-3 ">
            <h1 className="fw-normal">Please Login </h1>
            <h3><Badge>Admin</Badge></h3>
          </div>

          {/* Load the form component */}
          <LoginForm employee={true} />

        </div>
      </main>
    </Layout>
  );
}
