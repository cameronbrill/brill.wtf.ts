import axios from 'axios';
import config from '../../config.json';

export const getProjects = async () => {
  const { data } = await axios.get(
    `https://api.github.com/users/${config.social.github}/repos`,
  );
  return data;
};

export const getReadme = async () => {
  const { data } = await axios.get(config.readmeUrl);
  return data;
};

export const getWeather = async (city?: string) => {
  try {
    const { data } = await axios.get(`https://wttr.in/${city || ''}?ATm`);
    return data;
  } catch (error) {
    return error;
  }
};

export const getQuote = async () => {
  const { data } = await axios.get('https://api.quotable.io/random');
  return {
    quote: `“${data.content}” — ${data.author}`,
  };
};

export const newLink = async (args: string[]) => {
  const link = {
    original: args[0],
    want: args[1],
    forever: args[2] === 'forever',
  };

  const usage = 'Usage: link [original] [want]';
  if (!link.original) {
    throw `${usage}. Example: \n$ link https://youtu.be/dQw4w9WgXcQ video\n$ > https://brill.wtf/video`;
  }

  var validURL = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  if (!validURL.test(link.original)) {
    throw `${usage}. [link] must be a valid URL.`;
  }

  const q = getQueryString(link, ['original']);

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_LINK_API_DOMAIN}/link${q ? `?${q}` : ''}`,
    {
      original: link.original,
    },
  );

  return data.short;
};

export const getLink = async (link: { short: string; redirect?: boolean }) => {
  const q = getQueryString(link);
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_LINK_API_DOMAIN}/link${q ? `?${q}` : ''}`,
  );

  return data;
};

const getQueryString = (obj: any, ignore?: string[]) => {
  return Object.keys(obj)
    .filter((key) => (!ignore || !ignore.includes(key)) && !!obj[key])
    .map((key) => key + '=' + obj[key])
    .join('&');
};
