import redirect from 'nextjs-redirect';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getLink } from '../utils/api';

const Link = () => {
  const router = useRouter();
  const short = router.query.short;

  const [toRedirect, setRedirect] = useState(null);

  useEffect(() => {
    if (!!short)
      getLink({
        short: String(short),
      })
        .then((data) => {
          setRedirect(data.original);
        })
        .catch((e) => {
          router.push('/');
        });
  }, [short]);

  const Redirect = redirect(toRedirect);

  return toRedirect && <Redirect></Redirect>;
};

export default Link;
