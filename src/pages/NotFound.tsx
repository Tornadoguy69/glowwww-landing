import { Link } from "react-router-dom";
import { Layout } from "../components/site/Layout";
import { Icon } from "../components/site/Kit";
import { Fade } from "../components/site/Motion";

export function NotFound() {
  return (
    <Layout>
      <div className="wrap nf">
        <Fade as="p" className="eyebrow">404</Fade>
        <Fade as="h1">This page got folded into another app.</Fade>
        <Fade as="p">
          The link is either wrong or I moved something and forgot to leave a note. Either
          way, the homepage is right there.
        </Fade>
        <Fade>
          <p>
            <Link className="link-arrow" to="/">
              Back home <Icon.arrow size={15} />
            </Link>
          </p>
        </Fade>
      </div>
    </Layout>
  );
}

export default NotFound;
