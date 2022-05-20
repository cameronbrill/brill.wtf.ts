import {
  getProjects,
  getQuote,
  getReadme,
  getWeather,
  newLink,
  getLink,
} from '../api';

export const projects = async (args: string[]): Promise<string> => {
  const projects = await getProjects();
  return projects
    .map(
      (repo) =>
        `${repo.name} - <a class="text-light-blue dark:text-dark-blue underline" href="${repo.html_url}" target="_blank">${repo.html_url}</a>`,
    )
    .join('\n');
};

export const quote = async (args: string[]): Promise<string> => {
  const data = await getQuote();
  return data.quote;
};

export const readme = async (args: string[]): Promise<string> => {
  const readme = await getReadme();
  return `Opening GitHub README...\n
  ${readme}`;
};

export const weather = async (args: string[]): Promise<string> => {
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather casablanca';
  }
  const weather = await getWeather(city);
  return weather;
};

export const link = async (args: string[]): Promise<string> => {
  try {
    const link = await newLink(args);
    return `visit: https://brill.wtf/${link}`;
  } catch (e) {
    if (!!e.response?.data) {
      return `uh oh! there was an error:\n${JSON.stringify(e.response.data)}\n`;
    }
    return e;
  }
};
