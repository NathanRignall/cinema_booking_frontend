import Layout from "../../components/layouts/basic";

import { Container } from "react-bootstrap";

// main app function
export default function Main() {
  return (
    <Layout title="Login">
      <Container>
        <h2>Login</h2>
        <p>Please fill in your credentials to login.</p>

        {/* Load the form component */}
      </Container>
    </Layout>
  );
}
