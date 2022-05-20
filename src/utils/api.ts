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

export const getWeather = async (city: string) => {
  try {
    const { data } = await axios.get(`https://wttr.in/${city}?ATm`);
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

export const newLink = async (link: {
  original: string;
  want?: string;
  redirect?: boolean;
}) => {
  const q = getQueryString(link, ['original']);

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_LINK_API_DOMAIN}/link${q ? `?${q}` : ''}`,
    {
      original: link.original,
    },
  );

  return data.short;
};

const getQueryString = (obj: any, ignore?: string[]) => {
  return Object.keys(obj)
    .filter((key) => !ignore.includes(key) && !!obj[key])
    .map((key) => key + '=' + obj[key])
    .join('&');
};
