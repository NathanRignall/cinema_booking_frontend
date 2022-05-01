import { useRouter } from "next/router";
import useSWR from "swr";

import { AppWrapper } from "../context/state";
import { fetcher } from "../common/functions";

import { Loader } from "../widgets/basic";

import { Container } from "react-bootstrap";

// settings layout for pages with auth
const Layout = (props) => {
    // nextjs router
    const router = useRouter();

    // setup api connection
    const { data, error } = useSWR(
        process.env.NEXT_PUBLIC_API_URL + "/employee",
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    // check there is data in the request
    if (data) {
        if (error) {
            // some sort of error so push to login
            router.push({
                pathname: "/admin/login",
                query: { url: window.location.pathname },
            });
            return <Loader />;
        } else {
            // if data set the vars
            const userAccess = data.payload.Access;
            const requestAcess = props.access;

            // check the user has the right access
            if (requestAcess <= userAccess) {
                return (
                    <AppWrapper data={data.payload}>
                        <div>
                            <Container>{props.children}</Container>
                        </div>
                    </AppWrapper>
                );
            } else {
                return "Access Dennied";
            }
        }
    } else {
        if (error) {
            router.push({
                pathname: "/admin/login",
                query: { url: window.location.pathname },
            });
            return <Loader />;
        } else {
            return <Loader />;
        }
    }
};

export default Layout;