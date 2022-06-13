import Layout from "../components/layouts/basic";

import { useRouter } from "next/router";
import useSWR from "swr";

import { fetcher } from "../components/common/functions";
import { Loader } from "../components/widgets/basic";
import { ErrorDisplayer } from "../components/widgets/basic";

// main app function
export default function Main() {
    const router = useRouter();

    const { data, error } = useSWR(
        process.env.NEXT_PUBLIC_API_URL + "/session/logout",
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    if (data) {
        // okay push back to login page
        router.push("/");
        return <Loader />;
    } else {
        if (error) {
            // check if a not logged in error
            if (error.status == 401) {
                // not logged in
                router.push("/");
                return <Loader />;
            } else {
                // error that can't be ignored
                return (
                    <>
                        <Loader />
                        <ErrorDisplayer error={error} />
                    </>
                );
            }
        } else {
            // no data loading
            return <Loader />;
        }
    }
}