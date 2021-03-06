// swr fetcher (handles errors)
export const fetcher = async (url) => {
    const res = await fetch(url, { credentials: "include" });

    if (!res.ok) {
        const error = new Error("An error occurred while fetching the data.");

        error.info = await res;
        error.status = res.status;

        throw error;
    }

    return res.json();
};