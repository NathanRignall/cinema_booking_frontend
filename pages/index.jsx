import Head from 'next/head'
import Link from "next/link";

import Button from 'react-bootstrap/Button';

export default function Home() {
  return (
    <div>
      <Head>
        <title>DEV</title>
      </Head>

      USER AREA HERE


      <Link href="/admin">
            Admin Page
          </Link>

    </div>
  )
}
